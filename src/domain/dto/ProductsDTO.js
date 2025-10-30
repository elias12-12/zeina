export class ProductsDTO {
    constructor({ product_id, product_name, description, unit_price, product_type, status }) {
        this.product_id = product_id;
        this.product_name = product_name;
        this.description = description;
        this.unit_price = unit_price;
        this.product_type = product_type;
        this.status = status;
    }

     static fromEntity(entity){
        return new UsersDTO(entity);
    }
}