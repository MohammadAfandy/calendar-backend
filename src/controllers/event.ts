import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { BadRequestError, ValidationError } from '../configs/error';
import Event from '../models/event';
import { IEvent } from '../interfaces/event';

const validate = (data: IEvent): IEvent => {
  const { name, detail, tags, startDate, endDate, color } = data;
  const errors = [];
  if (!name) errors.push({ param: 'name', message: 'name is required' });
  if (!startDate) errors.push({ param: 'startDate', message: 'startDate is required' });
  if (!endDate) errors.push({ param: 'endDate', message: 'endDate is required' });
  if (!Array.isArray(tags)) errors.push({ param: 'tags', message: 'tags must be an array' });

  if (startDate > endDate) errors.push({ param: 'startDate', message: 'startDate must be smaller than endDate' });
  if (endDate < startDate) errors.push({ param: 'endDate', message: 'endDate must be greater than startDate' });

  if (errors.length) throw new ValidationError('Validation Fail', errors);
  return { name, detail, tags, startDate, endDate, color };
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const {
      startDate,
      endDate,
      name,
      tags
    }: {
      startDate?: Date,
      endDate?: Date,
      name?: string,
      tags?: string[],
    } = req.query;

    const errors = [];
    if (startDate && endDate) {
      if (startDate > endDate) errors.push({ param: 'startDate', message: 'startDate must be smaller than endDate' });
      if (endDate < startDate) errors.push({ param: 'endDate', message: 'endDate must be greater than startDate' });
    }
    if (errors.length) throw new ValidationError('Validation Fail', errors);

    const conditions: Record<string, any> = {};
    conditions.user = req.token._userId;
    if (startDate) conditions.startDate = { $gte: moment(startDate).startOf('day').toDate() };
    if (endDate) conditions.endDate = { $lte: moment(endDate).endOf('day').toDate() };
    if (name) conditions.name = { $regex: name, $options: 'i' };
    if (Array.isArray(tags)) conditions.tags = { $all: tags };

    const events = await Event.find(conditions).exec();
    res.json(events);
  } catch(err) {
    next(err);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).exec();
    res.json(event);
  } catch(err) {
    next(err);
  }
};

export const store = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = validate(req.body);
    data.user = req.token._userId;
    const event = new Event(data);
    await event.save();
    res.json(event);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      _id: id,
      user: req.token._userId,
    });
    if (!event) throw new BadRequestError();

    const data = validate(req.body);
    data.user = req.token._userId;
    Object.assign(event, data);
    await event.save();
    res.json(event);
  } catch (err) {
    next(err);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      _id: id,
      user: req.token._userId,
    });
    if (!event) throw new BadRequestError();

    await event.delete();
    res.json(event);
  } catch (err) {
    next(err);
  }
};
