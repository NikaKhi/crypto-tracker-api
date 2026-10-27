import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

import { initDatabase } from './database/init';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { CryptoController } from './controllers/crypto.controller';
import { startScheduler, stopScheduler } from './tasks/price-scheduler';

dotenv.config();

initDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

app.get('/status', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/cryptos', authMiddleware);
app.get('/api/cryptos', CryptoController.getAll);
app.post('/api/cryptos', CryptoController.add);
app.get('/api/cryptos/:id/history', CryptoController.getHistory);
app.delete('/api/cryptos/:id', CryptoController.remove);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startScheduler();
});

const gracefulShutdown = () => {
  stopScheduler();
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default app;