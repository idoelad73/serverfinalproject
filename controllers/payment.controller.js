import { createOrder, capturePayment } from '../services/payment.service.js';


export default {
    createOrderPaypal: async (req, res) => {
        try {
            const orderId = await createOrder();
            console.log('orderid server',orderId)
            res.status(200).json({ orderId });
           
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    capturePaymentPaypal: async (req, res) => {
        try {
            const { orderId } = req.body;
            console.log(orderId)
            const payment = await capturePayment(orderId);
            res.status(200).json({ payment });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
}