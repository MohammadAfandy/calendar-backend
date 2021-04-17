import mongoose from 'mongoose';
import config from './config';

const { url, name, user, password } = config.mongoDb;
mongoose.connect(url || '', {
  dbName: name,
  user: user,
  pass: password,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(`Connected to MongoDB - ${url} - ${name}`))
  .catch((err) => {
    console.log(`Error connect to MongoDB - ${url}`);
    console.log(err);
  });

mongoose.set('debug', config.debug);
export default mongoose;
