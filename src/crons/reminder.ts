import cron from 'node-cron';
import moment from 'moment';
import Event from '../models/event';
import telgramBot from '../services/telegram';

cron.schedule('* * * * *', async () => {
  console.log('----- CRON REMINDER ----');
  console.log('---- Start Running on ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' -----');

  const now = new Date();

  // event that will be happening in 1 hour
  const in_1hour = moment(now).add(1, 'hours').toDate();
  const start_in_1hour = moment(in_1hour).startOf('minute').toDate();
  const end_in_1hour = moment(in_1hour).endOf('minute').toDate();
  
  const prom_events_in_1hour = Event.find({
    startDate: {
      $gte: start_in_1hour,
      $lte: end_in_1hour,
    }
  }).populate('user').exec();

  const in_30minute = moment(now).add(30, 'minute').toDate();
  const start_in_30minute = moment(in_30minute).startOf('minute').toDate();
  const end_in_30minute = moment(in_30minute).endOf('minute').toDate();
  
  const prom_events_in_30minute = Event.find({
    startDate: {
      $gte: start_in_30minute,
      $lte: end_in_30minute,
    }
  }).populate('user').exec();

  const in_5minute = moment(now).add(5, 'minute').toDate();
  const start_in_5minute = moment(in_5minute).startOf('minute').toDate();
  const end_in_5minute = moment(in_5minute).endOf('minute').toDate();
  
  const prom_events_in_5minute = Event.find({
    startDate: {
      $gte: start_in_5minute,
      $lte: end_in_5minute,
    }
  }).populate('user').exec();

  const [
    events_in_1hour,
    events_in_30minute,
    events_in_5minute,
  ] = await Promise.all([
    prom_events_in_1hour,
    prom_events_in_30minute,
    prom_events_in_5minute,
  ]);

  for (const event of events_in_1hour) {
    if (typeof event.user === 'object') {
      const { telegramAccount, telegramNotification } = event.user;
      if (telegramAccount && telegramNotification) {
        const message = `
          You have this event in the next 1 hour
          ${event.name}
          ${moment(event.startDate).format('HH:mm')} - ${moment(event.endDate).format('HH:mm')}
        `;
        telgramBot.sendMessage(telegramAccount.chatId, message);
      }
    }
  }

  for (const event of events_in_30minute) {
    if (typeof event.user === 'object') {
      const { telegramAccount, telegramNotification } = event.user;
      if (telegramAccount && telegramNotification) {
        const message = `
          You have this event in the next 30 minutes
          ${event.name}
          ${moment(event.startDate).format('HH:mm')} - ${moment(event.endDate).format('HH:mm')}
        `;
        telgramBot.sendMessage(telegramAccount.chatId, message);
      }
    }
  }

  for (const event of events_in_5minute) {
    if (typeof event.user === 'object') {
      const { telegramAccount, telegramNotification } = event.user;
      if (telegramAccount && telegramNotification) {
        const message = `
          You have this event in the next 5 minutes
          ${event.name}
          ${moment(event.startDate).format('HH:mm')} - ${moment(event.endDate).format('HH:mm')}
        `;
        telgramBot.sendMessage(telegramAccount.chatId, message);
      }
    }
  }

  console.log('---- End Running on ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' -----');
});

export default cron;
