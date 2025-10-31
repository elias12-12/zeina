import { pool } from "../../config/db.js";
import { Inventory } from "../entities/Inventory.js";

export class InventoryRepository {
    async create({ product_id, quantity_in_stock }) {
        const sql = `
            INSERT INTO inventory (product_id, quantity_in_stock)
            VALUES ($1, $2)
            RETURNING inventory_id, product_id, quantity_in_stock, TO_CHAR(last_updated, 'DD/MM/YYYY') as last_updated;
        `;
        const { rows } = await pool.query(sql, [product_id, quantity_in_stock]);
        return new Inventory(rows[0]);
    }

    async findAll() {
        const sql = `SELECT inventory_id, product_id, quantity_in_stock, TO_CHAR(last_updated, 'DD/MM/YYYY') as last_updated FROM inventory ORDER BY inventory_id DESC;`;
        const { rows } = await pool.query(sql);
        return rows.map(r => new Inventory(r));
    }

    async findByProductId(product_id) {
        const sql = `SELECT inventory_id, product_id, quantity_in_stock, TO_CHAR(last_updated, 'DD/MM/YYYY') as last_updated FROM inventory WHERE product_id = $1;`;
        const { rows } = await pool.query(sql, [product_id]);
        return rows[0] ? new Inventory(rows[0]) : null;
    }

    async update(product_id, quantity_in_stock) {
        const sql = `
            UPDATE inventory
            SET quantity_in_stock = $1, last_updated = NOW()
            WHERE product_id = $2
            RETURNING inventory_id, product_id, quantity_in_stock, TO_CHAR(last_updated, 'DD/MM/YYYY') as last_updated;
        `;
        const { rows } = await pool.query(sql, [quantity_in_stock, product_id]);
        return rows[0] ? new Inventory(rows[0]) : null;
    }

    async delete(product_id) {
        const { rowCount } = await pool.query(`DELETE FROM inventory WHERE product_id = $1`, [product_id]);
        return rowCount > 0;
    }
}