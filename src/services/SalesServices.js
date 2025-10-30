import { SalesDTO } from '../domain/dto/SalesDTO.js';

export class SalesServices {
    constructor(salesRepository) {
        this.salesRepository = salesRepository;
    }

    async getAllSales() {
        try {
            const sales = await this.salesRepository.findAll();
            return sales.map(sale => SalesDTO.fromEntity(sale));
        } catch (error) {
            throw new Error(`Failed to list sales: ${error.message}`);
        }
    }

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
