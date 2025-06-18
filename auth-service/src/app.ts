import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import logger from './utils/logger';
import { apiRoutes } from './api';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'Auth Service' });
});

app.use('/api/v1', apiRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

app.listen(config.server.port, () => {
  logger.info(`Auth service is running on port ${config.server.port}`);
  logger.info(`Environment: ${config.server.env}`);
});

export default app;
