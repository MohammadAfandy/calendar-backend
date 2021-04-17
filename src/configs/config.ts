import 'dotenv/config';

const ENV = process.env;
const config = {
  appName: ENV.APP_NAME || 'My App',
  appSecret: ENV.APP_SECRET || '',
  port: ENV.PORT || '3000',
  debug: ENV.DEBUG === 'true' ? true : false,
  mongoDb: {
    url: ENV.MONGODB_URI,
    name: ENV.MONGODB_NAME,
    user: ENV.MONGODB_USER,
    password: ENV.MONGODB_PASSWORD,
  },
  clientUrl: ENV.CLIENT_URL,
  google: {
    clientId: ENV.GOOGLE_CLIENT_ID,
    clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    redirectUrl: ENV.GOOGLE_REDIRECT_URL,
  },
  telegram: {
    token: ENV.TELEGRAM_TOKEN || '',
  }
};

export default config;
