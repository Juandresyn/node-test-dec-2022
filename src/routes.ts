import { Router } from 'express';

import carsRouter from './controllers/carController';
import reservationRouter from './controllers/reservationController';
import usersRouter from './controllers/userController';
import welcomeController from './controllers/welcomeController';

const router: Router = Router();

router.get('/', welcomeController);
router.use('/users', usersRouter);
router.use('/cars', carsRouter);
router.use('/reservations', reservationRouter);

export default router;
