export class Sales{
    constructor({sale_id = null, user_id = null, sale_date = new Date(), total_amount = 0}) {
        this.sale_id = sale_id;
        this.user_id = user_id;
        this.sale_date = sale_date;
        this.total_amount = total_amount;
    }
}
