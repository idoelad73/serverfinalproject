import express from 'express';
import paymentController from '../controllers/payment.controller.js';
const { createOrderPaypal, capturePaymentPaypal } = paymentController;

const router = express.Router();

router.post('/create-order',createOrderPaypal);
router.post('/capture-payment', capturePaymentPaypal);

export default router;