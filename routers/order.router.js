import express from 'express';
import verifyToken from '../middelwares/verifyToken.js';
import orderController from '../controllers/order.controller.js';
import validateDto from '../middelwares/validateDto.js'
import { createOrderValidation, updateOrderValidation, updateOrderValidationParams } from '../validations/order.validation.js';
const { createOrder , getAllOrders , updateOrder , getOrdersByUserId,getOrdersByCategory,deleteOrder} = orderController;

const router = express.Router();


router.get('/',/*verifyToken,*/  getAllOrders);
router.post('/createorder', /*verifyToken,*/validateDto(createOrderValidation),createOrder);
router.put('/updateorder/:id', /*verifyToken,*/ validateDto(updateOrderValidationParams, 'params'),validateDto(updateOrderValidation), updateOrder);
router.get('/user-orders/:id',getOrdersByUserId)
router.get('/category-orders',getOrdersByCategory)
router.delete('/deleteorder/:id', /*verifyToken,*/ validateDto(updateOrderValidationParams, 'params'),deleteOrder);

export default router;
