import { Request, Response, NextFunction } from 'express';
import * as googleService from '../services/google';
import User from '../models/user';
import { signJwt } from '../services/jwt';
import config from '../configs/config';
import * as encryption from '../utils/encrypt';
import { ValidationError, BadRequestError } from '../configs/error';

const validate = (data: Record<any, any>) => {
  const { phoneNumber, telegramAccount, whatsappNotification, telegramNotification } = data;
  const errors = [];
  if (phoneNumber) {
    if ((/^[0-9]{0,15}$/g).test(phoneNumber) === false) {
      errors.push({ param: 'phoneNumber', message: 'phoneNumber must be a number below 16 digit' });
    }
  }
  if (whatsappNotification !== undefined && typeof whatsappNotification !== 'boolean') {
    errors.push({ param: 'whatsappNotification', message: 'whatsappNotification must true / false' });
  }
  if (telegramNotification !== undefined && typeof telegramNotification !== 'boolean') {
    errors.push({ param: 'telegramNotification', message: 'telegramNotification must true / false' });
  }

  if (errors.length) throw new ValidationError('Validation Fail', errors);
  return { phoneNumber, telegramAccount, whatsappNotification, telegramNotification };
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { _userId } = req.token;
    const user = await User.findById(_userId).exec();
    if (!user) throw new BadRequestError();

    const telegramAccount = user.telegramAccount?.username || '';
    const telegramLink = telegramAccount ? 'https://t.me/AfandyCalendarAppBot?start=' + encryption.encrypt(telegramAccount) : '';

    res.json({
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      authType: user.authType,
      phoneNumber: user.phoneNumber,
      telegramAccount: telegramAccount,
      telegramLink: telegramLink,
      whatsappNotification: user.whatsappNotification,
      telegramNotification: user.telegramNotification,
    });
  } catch(err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { _userId } = req.token;
    let data = validate(req.body);
    const user = await User.findById(_userId);
    if (!user) throw new BadRequestError();
    data = {
      ...data,
      telegramAccount: {
        username: data.telegramAccount,
        chatId: '',
      }
    };
    Object.assign(user, data);
    await user.save();
    res.json(user);
  } catch(err) {
    next(err);
  }
};

export const googleLoginPage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    res.redirect(googleService.loginPage());
  } catch(err) {
    next(err);
  }
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const code = req.query.code as string;
    const profile = await googleService.callBack(code);
    const userEmail = profile.email;

    const userData = {
      username: userEmail,
      fullname: profile.name,
      authType: 'Google',
      authId: profile.id,
      email: userEmail,
      // phoneNumber: '',
      // telegramAccount: '',
      // whatsappNotification: false,
      // telegramNotification: false,
    };

    let user = await User.findOne({
      authId: profile.id,
      authType: 'Google',
    }).exec();
    if (!user) {
      user = new User(userData);
    } else {
      Object.assign(user, userData);
    }
    const savedUser = await user.save();

    const token = await signJwt(savedUser);
    res.redirect(`${config.clientUrl}?token=${token}`);
  } catch (error) {
    next(error);
  }
};
