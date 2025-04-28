// backend/src/api/auth.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';
import { validate } from '../lib/validators';

const router = Router();

router.post(
  '/register',
  validate([
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['cliente','admin','repartidor'])
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').isEmail(),
    body('password').isString().notEmpty()
  ]),
  login
);

export default router;
