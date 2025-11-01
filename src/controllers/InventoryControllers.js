import { validationResult } from 'express-validator';

/**
 * InventoryControllers
 *
 * Controller class that exposes HTTP handlers for inventory-related routes.
 * Each method follows the Express handler signature (req, res, next) and
 * delegates business logic to the provided inventoryService.
 *
 * Errors:
 * - Throws a ValidationError (name="ValidationError") from _validate when
 *   express-validator finds problems with the request. The error will include
 *   a `details` array with validation issues.
 *
 * Usage:
 *   const controller = new InventoryControllers(inventoryService);
 *   router.get('/inventory', controller.list);
 *
 */
export class InventoryControllers {
    /**
     * Create an InventoryControllers instance.
     * @param {Object} inventoryService - Service implementing inventory operations.
     *   Expected methods: getAllInventory, getInventoryByProduct, createInventoryRecord,
     *   updateInventory, deleteInventory, getAllWithDetails, getLowStockProducts
     */
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Validate the request using express-validator rules attached to the route.
     * If validation errors exist, throws an Error with name "ValidationError"
     * and a `details` property containing the array of issues.
     *
     * @param {import('express').Request} req
     * @throws {Error} ValidationError with `details` array
     * @private
     */
    _validate(req) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error("Validation Error");
            err.name = "ValidationError";
            err.details = errors.array();
            throw err;
        }
    }

    /**
     * GET /inventory
     * Return an array of inventory records.
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    list = async (req, res, next) => {
        try {
            const inventory = await this.inventoryService.getAllInventory();
            res.json(inventory);
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /inventory/:product_id
     * Retrieve the inventory record for a single product.
     *
     * Validates the request first (e.g. that product_id is present/valid).
     * Returns 404 if no record exists for the given product_id.
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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

    /**
     * POST /inventory
     * Create a new inventory record.
     * Expects product_id and quantity_in_stock in the request body.
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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

    /**
     * PUT /inventory/:product_id
     * Update the quantity_in_stock for an existing inventory record.
     * Returns 404 if the inventory record does not exist.
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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

    /**
     * DELETE /inventory/:product_id
     * Delete the inventory record for the given product.
     * Returns 204 on success, 404 if not found.
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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
    /**
     * GET /inventory/low-stock?threshold=5
     * Return products with quantity_in_stock less than or equal to `threshold`.
     * If threshold query param is not provided, defaults to 5.
     * Validates that threshold is a non-negative number.
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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