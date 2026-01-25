import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 128
    },

    description: {
        type: String,
        required: false,
        maxLength: 500
    },

    category: {
        type: String,
        required: true,
        enum: ['beauty', 'electronics', 'clothing', 'home', 'groceries', 'fragrances', 'furniture'] // ניתן להוסיף כאן את כל הקטגוריות הרלוונטיות
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    discountPercentage: {
        type: Number,
        required: false,
        min: 0,
        max: 100
    },

    rating: {
        type: Number,
        required: false,
        min: 0,
        max: 5
    },

    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },

    tags: {
        type: [String],
        required: false
    },

    images: {
        // Store a single image URL (first image from the JSON array)
        type: String,
        required: false,
        trim: true
    },

    brand: {
        type: String,
        required: false,
        trim: true
    }
}, {

    timestamps: true
});
productSchema.index({ updatedAt: -1 });
export default mongoose.model('Products', productSchema);