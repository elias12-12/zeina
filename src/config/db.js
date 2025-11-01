/**
 * Database configuration
 * - Exports:
 *   - pool: PG Pool instance configured from environment variables
 *   - healthCheck(): simple DB connectivity check (returns boolean)
 */
import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
});

export const healthCheck = async () => {
    const { rows } = await pool.query('SELECT 1 as ok');
    return rows[0].ok === 1;
}