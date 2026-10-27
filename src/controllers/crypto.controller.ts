import { Request, Response, NextFunction } from 'express';
import { CryptoService } from '../services/crypto.service';
import { AppError } from '../errors/AppError';

export class CryptoController {
  static getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CryptoService.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static add(req: Request, res: Response, next: NextFunction) {
    try {
      const { symbol, name } = req.body;
      if (!symbol || !name) {
        throw new AppError('Symbol and name are required', 400);
      }
      const data = CryptoService.add(symbol, name);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid ID format', 400);
      }
      const data = CryptoService.getHistory(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid ID format', 400);
      }
      const data = CryptoService.remove(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}