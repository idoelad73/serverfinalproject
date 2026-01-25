import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        index: true
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        product_rtp: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    total_price: {
        type: Number,
        required: true,
        default: 0
    },
    user_adress: {
        type: String,
        required: true
    },
    user_phone: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
}, { timestamps: true });



orderSchema.pre('save', async function (next) { 
    this.total_price = this.products.reduce((acc, product) => acc + product.product_rtp * product.quantity, 0);
    next();
});

export default mongoose.model('Orders', orderSchema);

