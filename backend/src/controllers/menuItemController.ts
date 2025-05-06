import { Request, Response, NextFunction } from 'express';
import * as menuItemService from '../services/menuItemService';
import { BASE_URL } from '../lib/config';

function withImageUrl(item: any) {
  const itemObj = item.toObject ? item.toObject() : item;
  
  return {
    ...itemObj,
    imageUrl: itemObj.imageId
      ? `${BASE_URL}/api/files/${itemObj.imageId}`
      : null
  };
}

export async function listMenuItems(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortBy as string) || 'name';
    const sortDir = req.query.sortDir === 'desc' ? -1 : 1;
    const fields = (req.query.fields as string)?.split(',') || undefined;
    
    // Mantener solo el filtro por restaurantId si está presente
    const filter: any = {};
    const restaurantId = req.query.restaurantId as string | undefined;
    if (restaurantId) filter.restaurantId = restaurantId;

    const { data, total } = await menuItemService.getMenuItems({
      filter,
      projection: fields,
      sort: { [sortField]: sortDir },
      page,
      limit
    });

    const payload = data.map(withImageUrl);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: payload
    });
  } catch (error) {
    res.status(500).json({ message: 'Error listando menu items', error });
  }
}


export async function getMenuItemById(req: Request, res: Response) {
  try {
    const item = await menuItemService.getMenuItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'MenuItem not found' });
    res.json(withImageUrl(item));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving menu item', error });
  }
}

export async function getMenuByRestaurant(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortBy as string) || 'name';
    const sortDir = req.query.sortDir === 'desc' ? -1 : 1;
    
    const restaurantId = req.params.id;
    
    // Usar el método getMenuItems con filtro por restaurantId
    const { data, total } = await menuItemService.getMenuItems({
      filter: { restaurantId },
      sort: { [sortField]: sortDir },
      page,
      limit
    });

    const payload = data.map(withImageUrl);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: payload
    });
  } catch (error) {
    next(error);
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

export async function createMenuItemsBulk(req: Request, res: Response) {
  try {
    const items = await menuItemService.createMenuItemsBulk(req.body);
    res.status(201).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error creando menú bulk', err });
  }
}

export async function updateMenuItemsBulk(req: Request, res: Response) {
  try {
    // req.body = { filter: {...}, update: {...} }
    const result = await menuItemService.updateMenuItemsBulk(req.body.filter, req.body.update);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando menú bulk', err });
  }
}

export async function deleteMenuItemsBulk(req: Request, res: Response) {
  try {
    // req.body = { ids: [id1,id2,...] }
    const result = await menuItemService.deleteMenuItemsBulk(req.body.ids);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando menú bulk', err });
  }
}

