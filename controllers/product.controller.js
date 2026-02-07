import productModel from '../models/product.model.js';
import cloudinary from '../services/cloudinaryProvider.js';
import axios from 'axios';
import fs from 'fs-extra';



export default {
    getProductsByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            const { page = 1, limit = 30 } = req.query;

            /* ---------------- VALIDATE CATEGORY ---------------- */
            const allowedCategories = [
                "beauty",
                "fragrances",
                "furniture",
                "groceries"
            ];

            if (!allowedCategories.includes(category)) {
                return res.status(400).json({
                    message: 'Invalid category'
                });
            }

            /* ---------------- PAGINATION ---------------- */
            const pageNum = parseInt(page, 10) || 1;
            const limitNum = parseInt(limit, 10) || 30;
            const skip = (pageNum - 1) * limitNum;

            /* ---------------- QUERY ---------------- */
            const [products, total] = await Promise.all([
                productModel
                    .find({ category })
                    .sort({ updatedAt: -1 }) // newest first
                    .skip(skip)
                    .limit(limitNum),

                productModel.countDocuments({ category })
            ]);

            res.status(200).json({
                message: 'Products retrieved successfully',
                category,
                products,
                total,
                page: pageNum,
                limit: limitNum
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to retrieve products by category',
                error: error.message
            });
        }
    },

    searchProducts :async (req, res) => {
        try {
          const { q, page = 1, limit = 10 } = req.query;
      
          // No query → empty result
          if (!q || q.trim() === '') {
            return res.status(200).json({
              products: [],
              total: 0,
              page: Number(page),
              limit: Number(limit),
              totalPages: 0
            });
          }
      
          const pageNum = Number(page) || 1;
          const limitNum = Number(limit) || 10;
          const skip = (pageNum - 1) * limitNum;
      
          /* =========================================================
             🔵 ATLAS SEARCH (Production)
          ========================================================= */
          if (process.env.USE_ATLAS_SEARCH === 'true') {
            const pipeline = [
              {
                $search: {
                  index: 'search_products_test',
                  compound: {
                    should: [
                      {
                        autocomplete: {
                          query: q,
                          path: 'title',
                          score: { boost: { value: 3 } },
                          fuzzy: { maxEdits: 2, prefixLength: 2 }
                        }
                      },
                      {
                        autocomplete: {
                          query: q,
                          path: 'description',
                          score: { boost: { value: 1 } },
                          fuzzy: { maxEdits: 2, prefixLength: 2 }
                        }
                      }
                    ]
                  }
                }
              },
              { $addFields: { score: { $meta: 'searchScore' } } },
              {
                $facet: {
                  metadata: [{ $count: 'total' }],
                  data: [
                    { $skip: skip },
                    { $limit: limitNum },
                    {
                      $project: {
                        title: 1,
                        description: 1,
                        images: 1,
                        score: 1
                      }
                    }
                  ]
                }
              }
            ];
      
            const result = await productModel.aggregate(pipeline);
      
            const products = result[0]?.data || [];
            const total = result[0]?.metadata[0]?.total || 0;
      
            return res.status(200).json({
              products,
              total,
              page: pageNum,
              limit: limitNum,
              totalPages: Math.ceil(total / limitNum)
            });
          }
      
          /* =========================================================
             🟡 LOCAL SEARCH (Regex fallback)
          ========================================================= */
          const filter = {
            $or: [
              { title: { $regex: q, $options: 'i' } },
              { description: { $regex: q, $options: 'i' } }
            ]
          };
      
          const [products, total] = await Promise.all([
            productModel
              .find(filter)
              .sort({ updatedAt: -1 })
              .skip(skip)
              .limit(limitNum),
      
            productModel.countDocuments(filter)
          ]);
      
          return res.status(200).json({
            products,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
          });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({
            message: 'Error searching products',
            error: error.message
          });
        }
      },
      

    createProduct: async (req, res) => {


        try {
            // Explicitly build product object (same pattern as update)
            const productData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                discountPercentage: req.body.discountPercentage,
                rating: req.body.rating,
                stock: req.body.stock,
                brand: req.body.brand,
                tags: req.body.tags
                    ? req.body.tags.split(',').map(t => t.trim())
                    : []
            };


            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: "products"
                      });
                      
                    //   product.image = result.secure_url;
                      

                    productData.images = result.secure_url;

                    // remove temp file
                    await fs.remove(req.file.path);
                } catch (error) {
                    console.error(error);
                    throw new Error('Error uploading image');
                }
            }
            const lastProduct = await productModel.findOne().sort({ id: -1 });
            productData.id = lastProduct ? lastProduct.id + 1 : 1;

            /* ---------------- CREATE PRODUCT ---------------- */
            const newProduct = await productModel.create(productData);

            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error creating product',
                error: error.message
            });
        }
    },


    // קבלת כל המוצרים
    getAllProducts: async (req, res) => {
        console.log('getAllProducts called');

        try {
            const { page = 1, limit = 30, filter = '{}' } = req.query;

            /* ---------------- PARSE FILTER ---------------- */
            let filterObject = {};
            try {
                filterObject =
                    typeof filter === 'string' && filter.trim() !== ''
                        ? JSON.parse(filter)
                        : {};
            } catch (e) {
                console.log('Error parsing filter, using empty object:', e.message);
                filterObject = {};
            }

            /* ---------------- PAGINATION ---------------- */
            const pageNum = parseInt(page, 10) || 1;
            const limitNum = parseInt(limit, 10) || 30;
            const skip = (pageNum - 1) * limitNum;

            /* ---------------- QUERY ---------------- */
            const [products, total] = await Promise.all([
                productModel
                    .find(filterObject)
                    .sort({ updatedAt: -1 }) // ✅ newest updated first
                    .skip(skip)
                    .limit(limitNum),

                productModel.countDocuments(filterObject)
            ]);

            res.status(200).json({
                message: 'Products retrieved successfully',
                products,
                total,
                page: pageNum,
                limit: limitNum
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error retrieving products',
                error: error.message
            });
        }
    },



    // קבלת מוצר לפי ID
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const productId = Number(req.params.id)
            const product = await productModel.findOne({ id: productId });
            // const product = await productModel.findById(id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.status(200).json({
                message: "Product retrieved successfully",
                product
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving product",
                error: error.message
            });
        }
    },

    // עדכון מוצר
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;

            // Explicitly build update object (IMPORTANT)
            const updateData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                discountPercentage: req.body.discountPercentage,
                rating: req.body.rating,
                stock: req.body.stock,
                brand: req.body.brand,
                tags: req.body.tags
                    ? req.body.tags.split(',').map(t => t.trim())
                    : []
            };

            // ✅ Handle image upload
            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: "products"
                      });
                      
                    //   product.image = result.secure_url;
                      


                    updateData.images = result.secure_url; // ✅ string, NOT array


                    await fs.remove(req.file.path);
                } catch (error) {
                    console.error(error);
                    throw new Error('Error uploading image');
                }
            }

            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                { $set: updateData },   // 👈 CRITICAL
                { new: true }
            );

            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error updating product',
                error: error.message
            });
        }
    }
    ,

    // מחיקת מוצר
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const productId = Number(req.params.id)
            const product = await productModel.findOneAndDelete({ id: productId });
            // const product = await productModel.findByIdAndDelete(id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.status(200).json({
                message: "Product deleted successfully",
                product
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error deleting product",
                error: error.message
            });
        }
    },

    deleteProducts: async (req, res) => {
        try {
            const { ids } = req.body;

            await productModel.deleteMany({ _id: { $in: ids } });
            res.status(200).json({
                message: "Products deleted successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error deleting products",
                error: error.message
            });
        }
    },

    downloadImage: async (req, res) => {
        try {
            const { url } = req.query;
            const response = await axios.get(url, { responseType: 'stream' });
            const contentType = response.headers['content-type'];
            res.setHeader('Content-Type', contentType);

            // Set content disposition to force download
            const filename = url.split('/').pop();
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            // Pipe the response to the client
            response.data.pipe(res);


        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error downloading image",
                error: error.message
            });
        }
    }
};
