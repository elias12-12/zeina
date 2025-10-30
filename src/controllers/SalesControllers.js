import { validationResult } from 'express-validator';

export class SalesControllers {
    constructor(salesService) {
        this.salesService = salesService;
    }

    // Validate input and throw error if invalid
    _validate(req) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error("Validation Error");
            err.name = "ValidationError";
            err.details = errors.array();
            throw err; 
        }
    }

    // List all sales
    list = async (req, res, next) => {
        try {
            const sales = await this.salesService.getAllSales();
            res.json(sales);
        } catch (err) {
            next(err);
        }
    }

    // Get a single sale by ID
    get = async (req, res, next) => {
        try {
            this._validate(req);
            const sale = await this.salesService.getSaleById(req.params.sale_id);
            if (!sale)
                return res.status(404).json({ message: "Sale not found" });
            res.json(sale);
        } catch (err) {
            next(err);
        }
    }

    // Get all sales by a specific customer
    getByCustomer = async (req, res, next) => {
        try {
            this._validate(req);
            const sales = await this.salesService.getSalesByCustomer(req.params.user_id);
            if (!sales || sales.length === 0)
                return res.status(404).json({ message: "No sales found for this customer" });
            res.json(sales);
        } catch (err) {
            next(err);
        }
    }

    // Create a new sale
    create = async (req, res, next) => {
        try {
            this._validate(req);
            const newSale = await this.salesService.createSale(req.body.user_id);
            res.status(201).json(newSale);
        } catch (err) {
            next(err);
        }
    }

    // Update sale total amount
    update = async (req, res, next) => {
        try {
            this._validate(req);
            const updatedSale = await this.salesService.updateSaleTotal(req.params.sale_id, req.body.total_amount);
            if (!updatedSale)
                return res.status(404).json({ message: "Sale not found" });
            res.json(updatedSale);
        } catch (err) {
            next(err);
        }
    }

    // Delete a sale
    delete = async (req, res, next) => {
        try {
            this._validate(req);
            const deleted = await this.salesService.deleteSale(req.params.sale_id);
            if (!deleted)
                return res.status(404).json({ message: "Sale not found" });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}
