import { pool } from "../../config/db.js";
import { Inventory } from "../entities/Inventory.js";

/**
 * InventoryRepository - Database operations for inventory
 * Methods:
 * - create({ product_id, quantity_in_stock })
 * - findAll()
 * - findByProductId(product_id)
 * - update(product_id, quantity_in_stock)
 * - findAllWithDetails(): returns inventory joined with product info
 * - findByLowStock(threshold)
 * - delete(product_id)
 */
export class InventoryRepository {
    /** Create inventory record and return the created entity */
    async create({ product_id, quantity_in_stock }) {
        const sql = `
            INSERT INTO inventory (product_id, quantity_in_stock)
            VALUES ($1, $2)
            RETURNING inventory_id, product_id, quantity_in_stock, TO_CHAR(last_updated, 'DD/MM/YYYY') as last_updated;
        `;
        const { rows } = await pool.query(sql, [product_id, quantity_in_stock]);
        return new Inventory(rows[0]);
    }

    /** Retrieve all inventory records */
    async findAll() {
        const sql = `SELECT inventory_id, product_id, quantity_in_stock, TO_CHAR(last_updated, 'DD/MM/YYYY') as last_updated FROM inventory ORDER BY inventory_id DESC;`;
        const { rows } = await pool.query(sql);
        return rows.map(r => new Inventory(r));
    }

    /** Find inventory record by product_id, or null if not found */
    async findByProductId(product_id) {
        const sql = `SELECT inventory_id, product_id, quantity_in_stock, TO_CHAR(last_updated, 'DD/MM/YYYY') as last_updated FROM inventory WHERE product_id = $1;`;
        const { rows } = await pool.query(sql, [product_id]);
        return rows[0] ? new Inventory(rows[0]) : null;
    }

    /** Update inventory quantity for a product and return updated entity or null */
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
    /** Retrieve inventory joined with product details */
async findAllWithDetails() {
    const sql = `
        SELECT 
            i.inventory_id,
            i.product_id,
            i.quantity_in_stock,
            TO_CHAR(i.last_updated, 'DD/MM/YYYY') as last_updated,
            p.product_name,
            p.unit_price,
            p.product_type,
            p.status
        FROM inventory i
        INNER JOIN products p ON i.product_id = p.product_id
        ORDER BY i.inventory_id DESC;
    `;
    const { rows } = await pool.query(sql);
    return rows;
}
    /** Find inventory items with quantity below threshold (default 5) */
async findByLowStock(threshold = 5) {
    const sql = `
        SELECT 
            i.inventory_id, 
            i.product_id, 
            i.quantity_in_stock, 
            TO_CHAR(i.last_updated, 'DD/MM/YYYY') as last_updated,
            p.product_name,
            p.unit_price,
            p.product_type,
            p.status
        FROM inventory i
        INNER JOIN products p ON i.product_id = p.product_id
        WHERE i.quantity_in_stock < $1
        ORDER BY i.quantity_in_stock ASC;
    `;
    const { rows } = await pool.query(sql, [threshold]);
    return rows;
}

    /** Delete inventory record by product_id; returns true when deleted */
    async delete(product_id) {
        const { rowCount } = await pool.query(`DELETE FROM inventory WHERE product_id = $1`, [product_id]);
        return rowCount > 0;
    }
}