import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';

const transactionController = new TransactionController();

const router = Router();

router.post('/transaction', transactionController.transaction);

router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/debited', transactionController.getCashOut);
router.get('/transactions/credited', transactionController.getCashIn);

export default router;
