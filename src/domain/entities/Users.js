/**
 * Users entity — represents a user in the system
 * Fields (simple types):
 * - user_id: number | null
 * - first_name: string
 * - last_name: string
 * - email: string
 * - phone_number: string
 * - password: string
 * - role: string
 */
export class Users {
    constructor({user_id = null,first_name,last_name,email,phone_number,password,role}){
        this.user_id =user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email=email;
        this.phone_number=phone_number;
        this.password = password;
        this.role=role;
        
    }
}