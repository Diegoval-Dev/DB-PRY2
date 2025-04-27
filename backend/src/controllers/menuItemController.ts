import { Request, Response, NextFunction } from 'express';
import * as menuItemService from '../services/menuItemService';

export async function getAllMenuItems(req: Request, res: Response) {
  try {
    const items = await menuItemService.getAllMenuItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving menu items', error });
  }
}

export async function getMenuItemById(req: Request, res: Response) {
  try {
    const item = await menuItemService.getMenuItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'MenuItem not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving menu item', error });
  }
}

export async function getMenuByRestaurant(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await menuItemService.getMenuItemsByRestaurant(req.params.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function createMenuItem(req: Request, res: Response) {
  try {
    const newItem = await menuItemService.createMenuItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error });
  }
}

export async function updateMenuItem(req: Request, res: Response) {
  try {
    const updated = await menuItemService.updateMenuItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'MenuItem not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error });
  }
}

export async function deleteMenuItem(req: Request, res: Response) {
  try {
    const deleted = await menuItemService.deleteMenuItem(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'MenuItem not found' });
    res.json({ message: 'MenuItem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
}
