import { Request, Response, NextFunction  } from 'express';
import * as orderService from '../services/orderService';

export async function getAllOrders(req: Request, res: Response) {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order', error });
  }
}

export async function getOrdersByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await orderService.getOrdersByUser(req.params.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const newOrder = await orderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const updated = await orderService.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
}
