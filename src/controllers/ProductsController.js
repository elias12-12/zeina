import { validationResult } from 'express-validator';

export class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }

    // Validate input and throw error if invalid
    _validate(req) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error("Validation Error");
            err.name = "ValidationError";
            err.details = errors.array();
            throw err; 
        }
    }

    // List all products
    list = async (req, res, next) => {
        try {
            const products = await this.productsService.getAllProducts();
            res.json(products);
        } catch (err) {
            next(err);
        }
    }

    // Get single product by ID
    get = async (req, res, next) => {
        try {
            this._validate(req);
            const product = await this.productsService.getProductById(req.params.product_id);
            if (!product)
                 return res.status(404).json({ message: "Product not found" });
            res.json(product);
        } catch (err) {
            next(err);
        }
    }

    // Create a new product
    create = async (req, res, next) => {
        try {
            this._validate(req);
            const newProduct = await this.productsService.createProduct(req.body);
            res.status(201).json(newProduct);
        } catch (err) {
            next(err);
        }
    }

    // Update an existing product
    update = async (req, res, next) => {
        try {
            this._validate(req);
            const updatedProduct = await this.productsService.updateProduct(req.params.product_id, req.body);
            if (!updatedProduct) 
                return res.status(404).json({ message: "Product not found" });
            res.json(updatedProduct);
        } catch (err) {
            next(err);
        }
    }

    // Delete a product
    delete = async (req, res, next) => {
        try {
            this._validate(req);
            const deleted = await this.productsService.deleteProduct(req.params.product_id);
            if (!deleted)
                 return res.status(404).json({ message: "Product not found" });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}
