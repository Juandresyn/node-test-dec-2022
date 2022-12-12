import { Router } from 'express';
// import usersRouter from './controllers/usersController';
import welcomeController from './controllers/welcomeController';
import usersRouter from './controllers/userController';
import carsRouter from './controllers/carController';
import reservationRouter from './controllers/reservationController';

const router: Router = Router();

router.get('/', welcomeController);
router.use('/users', usersRouter);
router.use('/cars', carsRouter);
router.use('/reservations', reservationRouter);

export default router;
