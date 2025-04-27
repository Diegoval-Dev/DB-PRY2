import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Ejecuta un array de ValidationChain y, si hay errores,
 * responde con 400 y el detalle de los mismos.
 */
export const validate =
  (chains: ValidationChain[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Ejecuta todas las validaciones
    await Promise.all(chains.map((chain) => chain.run(req)));

    // Obtiene resultados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
