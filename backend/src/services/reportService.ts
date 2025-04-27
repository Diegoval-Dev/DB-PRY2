// backend/src/services/reportService.ts

import { Types } from 'mongoose';
import ReviewModel from '../models/Review';
import OrderModel from '../models/Order';
import RestaurantModel from '../models/Restaurant';
import MenuItemModel from '../models/MenuItem';

export async function getTopRatedRestaurants(limit = 10) {
  return await ReviewModel.aggregate([
    { 
      $group: {
        _id: '$restaurantId',
        avgRating: { $avg: '$rating' }
      }
    },
    { $sort: { avgRating: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'restaurants',
        localField: '_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    { $unwind: '$restaurant' },
    {
      $project: {
        _id: 0,
        restaurantId: '$_id',
        name: '$restaurant.name',
        avgRating: 1
      }
    }
  ]);
}

export async function getMostOrderedMenuItems(limit = 10) {
  return await OrderModel.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.menuItemId',
        totalSold: { $sum: '$items.quantity' }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'menuitems',
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }
    },
    { $unwind: '$item' },
    {
      $project: {
        _id: 0,
        menuItemId: '$_id',
        name: '$item.name',
        totalSold: 1
      }
    }
  ]);
}

export async function getRestaurantSalesReport() {
  return await OrderModel.aggregate([
    {
      $group: {
        _id: '$restaurantId',
        totalSales: { $sum: '$total' }
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: '_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    { $unwind: '$restaurant' },
    {
      $project: {
        _id: 0,
        restaurantId: '$_id',
        name: '$restaurant.name',
        totalSales: 1
      }
    }
  ]);
}

export async function getUserOrderFrequency() {
  return await OrderModel.aggregate([
    {
      $group: {
        _id: '$userId',
        orderCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        orderCount: 1
      }
    }
  ]);
}

export async function getAverageRatingBySpecialty() {
  return await ReviewModel.aggregate([
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurantId',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    { $unwind: '$restaurant' },
    { $unwind: '$restaurant.specialties' },
    {
      $group: {
        _id: '$restaurant.specialties',
        avgRating: { $avg: '$rating' }
      }
    },
    { $sort: { avgRating: -1 } },
    {
      $project: {
        _id: 0,
        specialty: '$_id',
        avgRating: 1
      }
    }
  ]);
}
