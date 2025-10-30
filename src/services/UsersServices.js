import {UsersDTO} from '../domain/dto/UsersDTO.js';

export class UsersServices{
    constructor(usersRepository){
        this.usersRepository = usersRepository;
    }

    async listUsers(){
        try {
            const users = await this.usersRepository.findAll();
            return users.map(users => UsersDTO.fromEntity(users));
        } catch (error) {
            throw new Error(`Failed to list users: ${error.message}`);
        }
    }

        async getUsers(user_id){
            try {
                if (!user_id || isNaN(user_id)) {
                    throw new Error('Invalid user ID');
                }
                const user = await this.usersRepository.findById(user_id);
                if (!user) {
                    return null;
                }
                return UsersDTO.fromEntity(user);
            } catch (error) {
                throw new Error(`Failed to get user: ${error.message}`);
            }
        }
     async getUserById(user_id) {
        try {
            if (!user_id || isNaN(user_id)) {
                throw new Error('Invalid user ID');
            }

            const user = await this.usersRepository.findById(user_id);
            return user ? UsersDTO.fromEntity(user) : null;

        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }

    async createUsers(data){
        try {
            if (!data || !data.first_name || !data.last_name || !data.email || !data.phone_number || !data.password || !data.role) {
                throw new Error('Missing required fields: first_name,last_name,email,phone_number,password,role');
            }
            const user = await this.usersRepository.create(data);
            return UsersDTO.fromEntity(user);
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    async updateUsers(user_id, data){
        try {
            if (!user_id || isNaN(user_id)) {
                throw new Error('Invalid user ID');
            }
            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data provided for update');
            }
            const user = await this.usersRepository.update(user_id, data);
            return user ? UsersDTO.fromEntity(user) : null;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    async deleteUsers(user_id){
        try {
            if (!user_id || isNaN(user_id)) {
                throw new Error('Invalid user ID');
            }
            return await this.usersRepository.delete(user_id);
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    async registerUser(userData) {
        try {
            const { first_name, last_name, email, phone_number, password, role } = userData;

            if (!first_name || !last_name || !email || !phone_number || !password || !role) {
                throw new Error('Missing required fields: first_name, last_name, email, phone_number, password, role');
            }

            const newUser = await this.usersRepository.create(userData);
            return UsersDTO.fromEntity(newUser);

        } catch (error) {
            throw new Error(`Failed to register user: ${error.message}`);
        }
    }
    async loginUser(email, password) {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Find user by email
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare passwords
        if (user.password !== password) {
            throw new Error('Invalid email or password');
        }

        return {
            message: 'Login successful',
            user: UsersDTO.fromEntity(user)
        };
    } catch (error) {
        throw new Error(`Failed to login user: ${error.message}`);
    }
}
}