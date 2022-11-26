import { Router } from 'express';
import validateAuthorization from '../middlewares/authMiddleware';


import UserController from '../controllers/user.controller';

const userController = new UserController();

const router = Router();

router.post('/user/register', userController.register);
router.post('/user/login', userController.login);

export default router;
