import { pool } from "../../config/db.js";
import { Sales } from "../entities/Sales.js";

export class SalesRepository {
    //only it takes user_id as a parameter because in the saleItems islinked to it.
    async create({ user_id }) {
        const sql = `
            INSERT INTO sales (user_id)
            VALUES ($1)
            RETURNING sale_id, user_id, sale_date, total_amount;
        `;
        const { rows } = await pool.query(sql, [user_id]);
        return new Sales(rows[0]);
    }

    async updateTotalAmount(sale_id, total_amount) {
        const sql = `
            UPDATE sales
            SET total_amount = $1
            WHERE sale_id = $2
            RETURNING sale_id, user_id, total_amount, sale_date;
        `;
        const { rows } = await pool.query(sql, [total_amount, sale_id]);
        return rows[0] ? new Sales(rows[0]) : null;
    }

    async findAll() {
        const sql = `SELECT sale_id, user_id, total_amount, sale_date FROM sales ORDER BY sale_id DESC;`;
        const { rows } = await pool.query(sql);
        return rows.map(r => new Sales(r));
    }

    async findById(sale_id) {
        const sql = `SELECT sale_id, user_id, total_amount, sale_date FROM sales WHERE sale_id = $1;`;
        const { rows } = await pool.query(sql, [sale_id]);
        return rows[0] ? new Sales(rows[0]) : null;
    }

    async findByCustomer(user_id) {
        const sql = `SELECT sale_id, user_id, total_amount, sale_date FROM sales WHERE user_id = $1 ORDER BY sale_id DESC;`;
        const { rows } = await pool.query(sql, [user_id]);
        return rows.map(r => new Sales(r));
    }

    async delete(sale_id) {
        const { rowCount } = await pool.query(`DELETE FROM sales WHERE sale_id = $1`, [sale_id]);
        return rowCount > 0;
    }
}
