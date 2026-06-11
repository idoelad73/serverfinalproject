// importData.js
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Product from '../models/product.model.js';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/store_final';
const JSON_FILE_PATH = path.join(__dirname, 'storedb.json');

// Data Transformation and Import Logic
async function importProducts() {
    try {
        // A. Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully.');

        // B. Read and Parse JSON file
        const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
        const jsonData = JSON.parse(rawData);
        
        // Extract products array from JSON structure
        const productsArray = jsonData.products || jsonData;
        console.log(`🔎 Loaded ${productsArray.length} products from JSON file.`);

        // C. Clean up existing data (Optional: clear the collection before import)
        await Product.deleteMany({});
        console.log('🧹 Existing products cleared from the database.');

        // D. Extract and Transform Data
        const simplifiedProducts = productsArray.map(product => {
            // Select ONLY the fields that match the Product schema
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                category: product.category,
                price: product.price,
                discountPercentage: product.discountPercentage,
                rating: product.rating,
                stock: product.stock,
                tags: product.tags || [],
                // Store a single image URL (first image) instead of an array
                images: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
                brand: product.brand
            };
        });

        // E. Insert the simplified data into MongoDB
        await Product.insertMany(simplifiedProducts);

        console.log(`✨ Successfully imported ${simplifiedProducts.length} products!`);
        
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate ID errors
            console.error('❌ Data import error: Duplicate ID detected. Ensure IDs are unique or clear the collection first.');
        } else {
            console.error('❌ An error occurred during the import process:', error.message);
            console.error('Full error:', error);
        }
    } finally {
        // F. Disconnect from DB
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🛑 MongoDB connection closed.');
        }
    }
}

// Run the import
importProducts()
    .then(() => {
        console.log('✅ Import process completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Import process failed:', error);
        process.exit(1);
    });
export default importProducts