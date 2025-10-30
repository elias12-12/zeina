import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthCheck } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { UsersRoutes } from './routes/usersRoutes.js';
import { ProductsRoutes } from './routes/productsRoutes.js';
import { SalesRoutes } from './routes/SalesRoutes.js';
import { SaleItemsRoutes } from './routes/SaleItemsRoutes.js';
import { InventoryRoutes } from './routes/InventoryRoutes.js';

dotenv.config();

export const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', async(req, res)=>{
    try{
        res.json({ok: await healthCheck()})
    }catch(e){
        res.status(500).json({ok: false})
    }
});
app.use('/api/users', UsersRoutes);
app.use('/api/products',ProductsRoutes);
app.use('/api/sales',SalesRoutes);
app.use('/api/sale-items', SaleItemsRoutes);
app.use('/api/inventory',InventoryRoutes);

app.use(errorHandler);