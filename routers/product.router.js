import express from 'express';
import productController from '../controllers/product.controller.js';
import verifyToken from '../middelwares/verifyToken.js';
import validateDto from '../middelwares/validateDto.js';
import upload from '../middelwares/uploadFiles.js';
// import { createProductValidation } from '../validations/product.validation.js';
const { createProduct , getAllProducts , getProductById , updateProduct , deleteProduct , deleteProducts , searchProducts,getProductsByCategory , } = productController;

const router = express.Router();

         
router.get('/all', getAllProducts);                            // קבלת כל המוצרים
router.get('/info/:id', getProductById);                         // קבלת מוצר לפי ID
router.post('/add-product', upload.single('product_image'), createProduct);     // הוספת מוצר חדש
router.put('/:id',upload.single('product_image'),updateProduct);           
router.delete('/delete/:id', deleteProduct);          // מחיקת מוצר
// router.post('/delete-many', deleteProducts);          // מחיקת מוצרים
router.get('/autocomplete/products', searchProducts); 
router.get('/product-category/:category', getProductsByCategory);

export default router;
