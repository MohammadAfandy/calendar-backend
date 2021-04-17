import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/route';
import config from './configs/config';
import { HttpError, NotFoundError } from './configs/error';

import './configs/mongo';
import './crons/cron';
import './services/telegram';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError();
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code || 500).json({
    message: err.message,
    error: err.data,
  });
});

app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`));
