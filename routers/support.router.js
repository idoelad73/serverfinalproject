import express from 'express';
import supportController from '../controllers/support.controller.js';

const { sendSupportEmail, createSupportTicket ,getSupportTicketsByCategory,getAllTickets} = supportController;


const router = express.Router();

router.post('/send-ticket', sendSupportEmail);
router.post('/create-ticket', createSupportTicket);
router.get('/category-ticket', getSupportTicketsByCategory);
router.get('/getall-ticket',getAllTickets)
export default router;
