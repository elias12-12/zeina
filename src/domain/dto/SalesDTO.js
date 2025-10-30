export class SalesDTO {
    constructor({sale_id = null, user_id = null, sale_date = new Date(), total_amount = 0}) {
        this.sale_id = sale_id;
        this.user_id = user_id;
        this.sale_date = sale_date;
        this.total_amount = total_amount;
    }

    // mapper to convert entity to DTO
    static fromEntity(entity) {
        return new SalesDTO(entity);
    }
}