import orderModel from '../models/order.model.js';
import productModel from '../models/product.model.js';
import getNextOrderNumber from "../util/getNextOrderNumber.js";

export default {

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            await orderModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Order deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    createOrder: async (req, res) => {
        try {
            console.log("DEBUG: Received Body:", req.body);

            const userId = req.body.user_id;

            if (!userId) {
                return res.status(400).json({
                    error: "Authentication is disabled, but no user_id was provided."
                });
            }

            // 🔑 Get next order number (atomic)
            const orderNumber = await getNextOrderNumber();

            const order = await orderModel.create({
                ...req.body,
                user_id: userId,
                orderNumber
            });

            res.status(201).json({
                message: "Order created successfully",
                order
            });

        } catch (error) {
            console.error("Controller Error:", error);
            res.status(500).json({ error: error.message });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await orderModel.find().populate(["products.product_id", "user_id"]);
            res.status(200).json({ orders });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    getOrdersByUserId: async (req, res) => {
        try {
            let { id } = req.params;

            // CLEANER: Remove accidental colons if they slip in from frontend
            const cleanUserId = id.replace(':', '').trim();

            // Find all orders where user_id matches
            // We populate product_id to get actual product details (names, prices, etc.)
            const orders = await orderModel.find({ user_id: cleanUserId })
                .populate("products.product_id")
                .sort({ createdAt: -1 }); // Show newest orders first

            if (!orders || orders.length === 0) {
                return res.status(200).json({
                    message: "No orders found for this user",
                    orders: []
                });
            }

            res.status(200).json({ orders });
        } catch (error) {
            console.error("Get Orders By User Error:", error);
            res.status(500).json({ message: error.message });
        }
    },


    getOrdersByCategory: async (req, res) => {
        try {
            // Aggregate orders by product category
            const data = await orderModel.aggregate([
                // Split products array into separate docs
                { $unwind: '$products' },

                // Lookup product details to get category
                {
                    $lookup: {
                        from: 'products', // collection name in MongoDB
                        localField: 'products.product_id',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                { $unwind: '$productDetails' },

                // Group by product category
                {
                    $group: {
                        _id: '$productDetails.category',            // category name
                        totalOrders: { $sum: 1 },                   // total product entries
                        totalQuantity: { $sum: '$products.quantity' },
                        totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.product_rtp'] } }
                    }
                },

                // Sort descending by totalOrders
                { $sort: { totalOrders: -1 } }
            ]);

            res.status(200).json({ data });
        } catch (error) {
            console.error("Get Orders By Category Error:", error);
            res.status(500).json({ message: error.message });
        }
    },
    updateOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Update the order and return the updated document
            const updatedOrder = await orderModel.findByIdAndUpdate(id, updateData, { new: true })
                .populate('products.product_id', 'title category'); // <-- populate product info

            res.status(200).json(updatedOrder);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }

}