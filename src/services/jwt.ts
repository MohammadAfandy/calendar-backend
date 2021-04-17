import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user';
import config from '../configs/config';

export const signJwt = (user: IUser): Promise<any> => new Promise((resolve, reject) => {
  try {
    const token = jwt.sign({
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      }
    }, config.appSecret, { expiresIn: '7d' });
    
    resolve(token);
  } catch(error) {
    reject(error);
  }
});
