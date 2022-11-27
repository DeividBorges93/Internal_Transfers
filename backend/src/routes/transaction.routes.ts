import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';

const transactionController = new TransactionController();

const router = Router();

router.post('/transaction', transactionController.transaction);

export default router;
