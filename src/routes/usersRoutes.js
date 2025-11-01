/**
 * UsersRoutes - defines HTTP routes for user-related endpoints
 * Exports: UsersRoutes (Express Router)
 * Dependencies are instantiated via simple DI in this module.
 */
import { Router } from 'express'
import { UsersRepository } from '../domain/repositories/UsersRepository.js';
import { UsersServices } from '../services/UsersServices.js';
import { UsersController } from '../controllers/UsersController.js';

import{idParam, upsertUsers} from '../validators/UsersValidators.js';


/**
 * Dependency injection
 */
const repo = new UsersRepository();
const service = new UsersServices(repo);
const controller = new UsersController(service);

export const UsersRoutes = Router();

UsersRoutes.get('/', controller.list);
UsersRoutes.get('/:user_id', idParam, controller.get);
UsersRoutes.put('/:user_id', [...idParam, upsertUsers], controller.update);
UsersRoutes.post('/', upsertUsers, controller.create);
UsersRoutes.post('/login', controller.login);
UsersRoutes.delete('/:user_id', idParam, controller.delete);
