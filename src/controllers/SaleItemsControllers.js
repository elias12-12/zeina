import { validationResult } from 'express-validator';

export class SaleItemsControllers {
    constructor(saleItemsService) {
        this.saleItemsService = saleItemsService;
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
            const items = await this.saleItemsService.getAllSaleItems();
            res.json(items);
        } catch (err) {
            next(err);
        }
    }

    get = async (req, res, next) => {
        try {
            this._validate(req);
            const item = await this.saleItemsService.getSaleItemById(req.params.sale_item_id);
            if (!item)
                return res.status(404).json({ message: "Sale item not found" });
            res.json(item);
        } catch (err) {
            next(err);
        }
    }

    getBySaleId = async (req, res, next) => {
        try {
            this._validate(req);
            const items = await this.saleItemsService.getSaleItemsBySaleId(req.params.sale_id);
            if (!items || items.length === 0)
                return res.status(404).json({ message: "No items found for this sale" });
            res.json(items);
        } catch (err) {
            next(err);
        }
    }

    create = async (req, res, next) => {
        try {
            this._validate(req);
            const item = await this.saleItemsService.createSaleItem(
                req.body.sale_id,
                req.body.product_id,
                req.body.quantity,
                req.body.price_at_sale
            );
            res.status(201).json(item);
        } catch (err) {
            next(err);
        }
    }

    update = async (req, res, next) => {
        try {
            this._validate(req);
            const item = await this.saleItemsService.updateSaleItem(req.params.sale_item_id, req.body);
            if (!item)
                return res.status(404).json({ message: "Sale item not found" });
            res.json(item);
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        try {
            this._validate(req);
            const deleted = await this.saleItemsService.deleteSaleItem(req.params.sale_item_id);
            if (!deleted)
                return res.status(404).json({ message: "Sale item not found" });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    getWithDetails = async (req, res, next) => {
    try {
        this._validate(req);
        const item = await this.saleItemsService.getSaleItemByIdWithDetails(req.params.sale_item_id);
        if (!item)
            return res.status(404).json({ message: "Sale item not found" });
        res.json(item);
    } catch (err) {
        next(err);
    }
}
}