export class Sales{
    constructor({sale_id = null, user_id = null, sale_date = new Date(), subtotal, discount_percentage, discount_amount, total_amount = 0}) {
        this.sale_id = sale_id;
        this.user_id = user_id;
        this.sale_date = sale_date;
        this.subtotal=subtotal;
        this.discount_percentage=discount_percentage || 0;
        this.discount_amount=discount_amount || 0;
        this.total_amount = total_amount;
    }
}
