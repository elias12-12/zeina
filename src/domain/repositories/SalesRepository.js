import { pool } from "../../config/db.js";
import { Sales } from "../entities/Sales.js";

/**
 * SalesRepository - Database operations for Sales
 * Methods:
 * - create({ user_id }) : create a new sale record (initial totals zero)
 * - updateTotalAmount(sale_id, total_amount) : set total for a sale
 * - updateWithDiscount(sale_id, subtotal, discount_percentage) : apply discount and update totals
 * - findAll() : list sales
 * - findById(id) : get a sale by id
 * - findBetweenDates(first, second) : list sales between two dates (DD/MM/YYYY)
 * - findByCustomer(user_id) : list sales for a user
 * - delete(id) : remove a sale
 */
export class SalesRepository {
    //only it takes user_id as a parameter because in the saleItems islinked to it.
    /** Create a new sale record (initial totals set to zero) */
    async create({ user_id }) {
        const sql = `
            INSERT INTO sales (user_id, subtotal, discount_percentage, discount_amount, total_amount)
            VALUES ($1, 0, 0, 0, 0)
            RETURNING sale_id, user_id, TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date, subtotal, discount_percentage, discount_amount, total_amount;
        `;
        const { rows } = await pool.query(sql, [user_id]);
        return new Sales(rows[0]);
    }

    /** Update the total_amount for a sale and return the updated entity or null */
    async updateTotalAmount(sale_id, total_amount) {
        const sql = `
            UPDATE sales
            SET total_amount = $1
            WHERE sale_id = $2
            RETURNING sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount, TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date;
        `;
        const { rows } = await pool.query(sql, [total_amount, sale_id]);
        return rows[0] ? new Sales(rows[0]) : null;
    }
    
    /** Update sale totals applying a discount percentage and return updated entity or null */
    async updateWithDiscount(sale_id, subtotal, discount_percentage) {
        const discount_amount = (subtotal * discount_percentage) / 100;
        const total_amount = subtotal - discount_amount;
        
        const sql = `
            UPDATE sales
            SET subtotal = $1, discount_percentage = $2, discount_amount = $3, total_amount = $4
            WHERE sale_id = $5
            RETURNING sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount,TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date;
        `;
        const { rows } = await pool.query(sql, [subtotal, discount_percentage, discount_amount, total_amount, sale_id]);
        return rows[0] ? new Sales(rows[0]) : null;
    }

    /** List all sales */
    async findAll() {
        const sql = `SELECT sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount,TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date FROM sales ORDER BY sale_id DESC;`;
        const { rows } = await pool.query(sql);
        return rows.map(r => new Sales(r));
    }

    /** Find a sale by ID, or return null */
    async findById(sale_id) {
        const sql = `SELECT sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount, TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date FROM sales WHERE sale_id = $1;`;
        const { rows } = await pool.query(sql, [sale_id]);
        return rows[0] ? new Sales(rows[0]) : null;
    }
    /** Find sales between two dates (DD/MM/YYYY) */
    async findBetweenDates(startDate, endDate) {
    const sql = `
        SELECT 
            sale_id, 
            user_id, 
            subtotal, 
            discount_percentage, 
            discount_amount, 
            total_amount,
            TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date
        FROM sales 
        WHERE sale_date::date BETWEEN TO_DATE($1, 'DD/MM/YYYY') AND TO_DATE($2, 'DD/MM/YYYY')
        ORDER BY sale_date DESC;
    `;
    const { rows } = await pool.query(sql, [startDate, endDate]);
    return rows.map(r => new Sales(r));
}
    /** Find sales by customer user_id */
    async findByCustomer(user_id) {
        const sql = `SELECT sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount, TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date FROM sales WHERE user_id = $1 ORDER BY sale_id DESC;`;
        const { rows } = await pool.query(sql, [user_id]);
        return rows.map(r => new Sales(r));
    }
//get the total amount of all sales
    async getTotal(){
        const sql = `SELECT SUM(total_amount) as total FROM sales`
        const {rows}=await pool.query(sql);
        return rows[0].total;
    }

    /** Delete a sale by ID; returns true when deleted */
    async delete(sale_id) {
        const { rowCount } = await pool.query(`DELETE FROM sales WHERE sale_id = $1`, [sale_id]);
        return rowCount > 0;
    }
    async getCount(){
        const sql=`SELECT COUNT(*) as total_counts FROM sales`
        const {rows}=await pool.query(sql);
         return parseInt(rows[0].total_counts);
    }
}
