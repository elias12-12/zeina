/**
 * SalesRoutes - HTTP routes for sales operations (list, create, update, discount, delete)
 * Exports: SalesRoutes (Express Router)
 */
import { Router } from 'express';
import { SalesRepository } from '../domain/repositories/SalesRepository.js';
import { SalesServices } from '../services/SalesServices.js';
import { SalesControllers }  from '../controllers/SalesControllers.js';

import { idParam, userIdParam, upsertSales, applyDiscountValidator , getSaleBetweenDates } from '../validators/SalesValidators.js';

const repo = new SalesRepository();
const service = new SalesServices(repo);
const controller = new SalesControllers(service);

export const SalesRoutes = Router();

SalesRoutes.get('/', controller.list);
SalesRoutes.get('/by-date-range', getSaleBetweenDates, controller.getSalesBetweenDates);
SalesRoutes.get('/:sale_id', idParam, controller.get);
SalesRoutes.get('/customer/:user_id', userIdParam, controller.getByCustomer);
SalesRoutes.post('/', upsertSales, controller.create);
SalesRoutes.put('/:sale_id', [...idParam, upsertSales], controller.update);
SalesRoutes.put('/:sale_id/discount', [...idParam, ...applyDiscountValidator], controller.applyDiscount);
SalesRoutes.delete('/:sale_id', idParam, controller.delete);
