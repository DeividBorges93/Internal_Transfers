import { Router } from 'express';

import UserController from '../controllers/user.controller';

const userController = new UserController();

const router = Router();

router.get('/user/register', userController.register);

export default router;
