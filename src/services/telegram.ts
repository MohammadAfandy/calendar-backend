import TelegramBot from 'node-telegram-bot-api';
import config from '../configs/config';
import User from '../models/user';
import * as encryption from '../utils/encrypt';

const { telegram } = config;
const bot = new TelegramBot(telegram.token, { polling: true });

bot.onText(/\/start (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  try { 
    const resp = match ? match[1] : ''; // the captured "whatever"
    const decrypted = encryption.decrypt(resp) || '';
    // save chat_id to database
    User.updateOne({
      'telegramAccount.username': decrypted,
    }, {
      'telegramAccount.chatId': chatId,
    }).exec();
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, `Set event reminder for account ${decrypted} success.`);
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, 'failed');
  }
});

// bot.onText(/\/encrypt (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message
//   const chatId = msg.chat.id;
//   try { 
//     const resp = match ? match[1] : ''; // the captured "whatever"
//     const encrypted = encryption.encrypt(resp) || '';
//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, encrypted);
//   } catch (error) {
//     bot.sendMessage(chatId, 'failed');
//   }
// });

export default bot;
