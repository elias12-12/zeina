import { pool } from "../../config/db.js";
import { Sales } from "../entities/Sales.js";

export class SalesRepository {
    //only it takes user_id as a parameter because in the saleItems islinked to it.
   async create({ user_id }) {
        const sql = `
            INSERT INTO sales (user_id, subtotal, discount_percentage, discount_amount, total_amount)
            VALUES ($1, 0, 0, 0, 0)
            RETURNING sale_id, user_id, TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date, subtotal, discount_percentage, discount_amount, total_amount;
        `;
        const { rows } = await pool.query(sql, [user_id]);
        return new Sales(rows[0]);
    }

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

      async findAll() {
        const sql = `SELECT sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount,TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date FROM sales ORDER BY sale_id DESC;`;
        const { rows } = await pool.query(sql);
        return rows.map(r => new Sales(r));
    }

  async findById(sale_id) {
        const sql = `SELECT sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount, TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date FROM sales WHERE sale_id = $1;`;
        const { rows } = await pool.query(sql, [sale_id]);
        return rows[0] ? new Sales(rows[0]) : null;
    }

      async findByCustomer(user_id) {
        const sql = `SELECT sale_id, user_id, subtotal, discount_percentage, discount_amount, total_amount, TO_CHAR(sale_date, 'DD/MM/YYYY') as sale_date FROM sales WHERE user_id = $1 ORDER BY sale_id DESC;`;
        const { rows } = await pool.query(sql, [user_id]);
        return rows.map(r => new Sales(r));
    }

      async delete(sale_id) {
        const { rowCount } = await pool.query(`DELETE FROM sales WHERE sale_id = $1`, [sale_id]);
        return rowCount > 0;
    }
}
