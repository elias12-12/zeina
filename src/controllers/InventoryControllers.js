import { validationResult } from 'express-validator';

export class InventoryControllers {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }

    _validate(req) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error("Validation Error");
            err.name = "ValidationError";
            err.details = errors.array();
            throw err;
        }
    }

    list = async (req, res, next) => {
        try {
            const inventory = await this.inventoryService.getAllInventory();
            res.json(inventory);
        } catch (err) {
            next(err);
        }
    }

    getByProduct = async (req, res, next) => {
        try {
            this._validate(req);
            const inventory = await this.inventoryService.getInventoryByProduct(req.params.product_id);
            if (!inventory)
                return res.status(404).json({ message: "Inventory record not found" });
            res.json(inventory);
        } catch (err) {
            next(err);
        }
    }

    create = async (req, res, next) => {
        try {
            this._validate(req);
            const inventory = await this.inventoryService.createInventoryRecord(
                req.body.product_id,
                req.body.quantity_in_stock
            );
            res.status(201).json(inventory);
        } catch (err) {
            next(err);
        }
    }

    update = async (req, res, next) => {
        try {
            this._validate(req);
            const inventory = await this.inventoryService.updateInventory(
                req.params.product_id,
                req.body.quantity_in_stock
            );
            if (!inventory)
                return res.status(404).json({ message: "Inventory record not found" });
            res.json(inventory);
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        try {
            this._validate(req);
            const deleted = await this.inventoryService.deleteInventory(req.params.product_id);
            if (!deleted)
                return res.status(404).json({ message: "Inventory record not found" });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
    getAllWithDetails = async (req, res, next) => {
    try {
        const inventory = await this.inventoryService.getAllWithDetails();
        if (!inventory || inventory.length === 0)
            return res.status(404).json({ message: "No inventory records found" });
        
        res.json(inventory);
    } catch (err) {
        next(err);
    }
};
    getLowStock = async (req, res, next) => {
        try {
            const threshold = req.query.threshold ? parseInt(req.query.threshold) : 5;
            
            if (isNaN(threshold) || threshold < 0) {
                return res.status(400).json({ message: "Threshold must be a non-negative number" });
            }

            const lowStockItems = await this.inventoryService.getLowStockProducts(threshold);
            res.json({
                threshold: threshold,
                count: lowStockItems.length,
                items: lowStockItems
            });
        } catch (err) {
            next(err);
        }
    }
}