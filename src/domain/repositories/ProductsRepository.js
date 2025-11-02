import { pool } from "../../config/db.js";
import { Products } from "../entities/Products.js";

/**
 * ProductsRepository - Database operations for Products
 * Methods:
 * - create(data): Creates a new product record
 * - findAll(): Gets all products
 * - findById(id): Finds a product by ID
 * - update(id, data): Updates product record
 * - delete(id): Removes a product
 */
export class ProductsRepository {
    /** Create a product record and return the created entity */
    async create({ product_name, description, unit_price, product_type, status }) {
        const sql = `
            INSERT INTO products (product_name, description, unit_price, product_type, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const { rows } = await pool.query(sql, [product_name, description, unit_price, product_type, status]);
        return new Products(rows[0]);
    }

    /** Retrieve all product records */
    async findAll() {
        const sql = `SELECT * FROM products ORDER BY product_id DESC;`;
        const { rows } = await pool.query(sql);
        return rows.map(r => new Products(r));
    }

    /** Find a product by its ID, or return null */
    async findById(product_id) {
        const sql = `SELECT * FROM products WHERE product_id = $1;`;
        const { rows } = await pool.query(sql, [product_id]);
        return rows[0] ? new Products(rows[0]) : null;
    }

    /** Update a product by ID and return the updated entity or null */
    async update(product_id, { product_name, description, unit_price, product_type, status }) {
        const sql = `
            UPDATE products
            SET product_name=$1, description=$2, unit_price=$3, product_type=$4, status=$5
            WHERE product_id=$6
            RETURNING *;
        `;
        const { rows } = await pool.query(sql, [product_name, description, unit_price, product_type, status, product_id]);
        return rows[0] ? new Products(rows[0]) : null;
    }

    /** Delete a product by ID; returns true when deleted */
    async delete(product_id) {
        const { rowCount } = await pool.query(`DELETE FROM products WHERE product_id=$1;`, [product_id]);
        return rowCount > 0;
    }
}
