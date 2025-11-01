/**
 * ProductsServices - Business logic for product operations
 * Methods:
 * - createProduct(data): Creates a new product
 * - getAllProducts(): Retrieves all products
 * - getProductById(id): Gets a product by ID
 * - updateProduct(id, data): Updates a product
 * - deleteProduct(id): Deletes a product
 */
export class ProductsServices {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }

    async createProduct(productData) {
        try {
            if (!productData.product_name || !productData.unit_price || !productData.product_type || !productData.status) {
                throw new Error("Missing required fields: product_name, unit_price, product_type, status");
            }
            return await this.productsRepository.create(productData);
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    async getAllProducts() {
        try {
            return await this.productsRepository.findAll();
        } catch (error) {
            throw new Error(`Failed to get products: ${error.message}`);
        }
    }

    async getProductById(product_id) {
        try {
            if (!product_id || isNaN(product_id)) 
                throw new Error("Invalid product ID");

            const product = await this.productsRepository.findById(product_id);
            return product;
        } catch (error) {
            throw new Error(`Failed to get product: ${error.message}`);
        }
    }

    async updateProduct(product_id, updates) {
        try {
            if (!product_id || isNaN(product_id))
                 throw new Error("Invalid product ID");

            if (!updates || Object.keys(updates).length === 0) 
                throw new Error("No data provided for update");

            const updatedProduct = await this.productsRepository.update(product_id, updates);
            return updatedProduct;
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    async deleteProduct(product_id) {
        try {
            if (!product_id || isNaN(product_id)) 
                throw new Error("Invalid product ID");

            const deleted = await this.productsRepository.delete(product_id);
            return deleted;

        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }
}
