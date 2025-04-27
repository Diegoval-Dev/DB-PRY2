// backend/src/controllers/reportController.ts

import { Request, Response, NextFunction } from 'express';
import * as reportService from '../services/reportService';

export async function topRatedRestaurants(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await reportService.getTopRatedRestaurants(limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function mostOrderedItems(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await reportService.getMostOrderedMenuItems(limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function restaurantSales(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getRestaurantSalesReport();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function userOrderFrequency(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getUserOrderFrequency();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function avgRatingBySpecialty(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getAverageRatingBySpecialty();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
