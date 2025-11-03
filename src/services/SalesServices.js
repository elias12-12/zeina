import { SalesDTO } from '../domain/dto/SalesDTO.js';

/**
 * SalesServices - Business logic for sales operations
 * Methods:
 * - getAllSales(): Gets all sales records
 * - getSaleById(id): Gets a sale by ID
 * - createSale(data): Creates a new sale
 * - updateSale(id, data): Updates sale info
 * - deleteSale(id): Removes a sale record
 */
export class SalesServices {
    constructor(salesRepository) {
        this.salesRepository = salesRepository;
    }

    /**
     * Retrieve all sales and return as DTOs
     */
    async getAllSales() {
        try {
            const sales = await this.salesRepository.findAll();
            return sales.map(sale => SalesDTO.fromEntity(sale));
        } catch (error) {
            throw new Error(`Failed to list sales: ${error.message}`);
        }

    }

    /**
     * Get a sale by ID and return DTO, or null if not found
     */
    async getSaleById(sale_id) {
        try {
            if (!sale_id || isNaN(sale_id)) {
                throw new Error('Invalid sale ID');
            }
            const sale = await this.salesRepository.findById(sale_id);
            return sale ? SalesDTO.fromEntity(sale) : null;
        } catch (error) {
            throw new Error(`Failed to get sale: ${error.message}`);
        }
    }
    
    /**
     * Get sales between two dates (DD/MM/YYYY) and return DTOs
     */
async getSalesBetweenDates(startDate, endDate) {
    try {
        if (!startDate || !endDate) {
            throw new Error('Start date and end date are required');
        }

        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            throw new Error('Invalid date format. Use DD/MM/YYYY');
        }

        const sales = await this.salesRepository.findBetweenDates(startDate, endDate);
        return sales.map(sale => SalesDTO.fromEntity(sale));
        
    } catch (error) {
        throw new Error(`Failed to get sales: ${error.message}`);
    }

    }
    /**
     * Get sales for a specific customer (user_id) and return DTOs
     */
    async getSalesByCustomer(user_id) {
        try {
            if (!user_id || isNaN(user_id)) {
                throw new Error('Invalid user ID');
            }
            const sales = await this.salesRepository.findByCustomer(user_id);
            return sales.map(sale => SalesDTO.fromEntity(sale));
        } catch (error) {
            throw new Error(`Failed to get sales by customer: ${error.message}`);
        }

    }

    /**
     * Create a new sale for a given user_id and return DTO
     */
    async createSale(user_id) {
        try {
            if (!user_id || isNaN(user_id)) {
                throw new Error('Invalid user ID');
            }
            const sale = await this.salesRepository.create({ user_id });
            return SalesDTO.fromEntity(sale);
        } catch (error) {
            throw new Error(`Failed to create sale: ${error.message}`);
        }

    }

    /**
     * Update the total amount for a sale and return updated DTO
     */
    async updateSaleTotal(sale_id, total_amount) {
        try {
            if (!sale_id || isNaN(sale_id)) {
                throw new Error('Invalid sale ID');
            }
            if (total_amount == null || isNaN(total_amount)) {
                throw new Error('Invalid total amount');
            }
            const sale = await this.salesRepository.updateTotalAmount(sale_id, total_amount);
            return sale ? SalesDTO.fromEntity(sale) : null;
        } catch (error) {
            throw new Error(`Failed to update sale total: ${error.message}`);
        }

     }

         /**
          * Apply a discount percentage to a sale and update totals; return updated DTO
          */
         async applyDiscount(sale_id, discount_percentage) {
        try {
            if (!sale_id || isNaN(sale_id)) {
                throw new Error('Invalid sale ID');
            }
            if (discount_percentage == null || isNaN(discount_percentage)) {
                throw new Error('Invalid discount percentage');
            }
            if (discount_percentage < 0 || discount_percentage > 100) {
                throw new Error('Discount percentage must be between 0 and 100');
            }

            const currentSale = await this.salesRepository.findById(sale_id);
            if (!currentSale) {
                throw new Error('Sale not found');
            }

            const sale = await this.salesRepository.updateWithDiscount(sale_id, currentSale.subtotal, discount_percentage);
            return sale ? SalesDTO.fromEntity(sale) : null;
        } catch (error) {
            throw new Error(`Failed to apply discount: ${error.message}`);
        }

    }

    /**
     * Delete a sale by ID; returns true if deleted
     */
    async deleteSale(sale_id) {
        try {
            if (!sale_id || isNaN(sale_id)) {
                throw new Error('Invalid sale ID');
            }
            return await this.salesRepository.delete(sale_id);
        } catch (error) {
            throw new Error(`Failed to delete sale: ${error.message}`);
        }
    }
}
