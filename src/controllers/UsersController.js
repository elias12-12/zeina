import {validationResult} from 'express-validator'

/**
 * UsersController — minimal documentation
 * Common request pieces:
 * - req.params.user_id: number|string
 * - req.body: object (user fields for create/update)
 * - login expects { email: string, password: string } in req.body
 */
export class UsersController{
    constructor(userServices){
        this.userServices = userServices;
    }

    // Validate request using express-validator. If invalid, respond 400 and
    // return the response object; otherwise return null so callers continue.
    _validate(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        return null;
    }

    // GET /users — list all users
    list = async (req, res, next) =>{
        try{
            res.json(await this.userServices.listUsers());
        }catch(e){
            next(e);
        }
    }

    // GET /users/:user_id — get a single user
    get = async (req, res, next) => {
        try{
            if(this._validate(req, res)){
                return;
            }
            const data = await this.userServices.getUsers(req.params.user_id);
            if(!data){
                return res.status(404).json({message: 'Not Found'})
            }
            res.status(200).json(data)
        }catch(e){
            next(e);
        }
    }

    // POST /users — create a user; expects user object in req.body
    create = async (req, res, next) =>{
        try{
            if(this._validate(req, res)){
            return;
        }
        const data = await this.userServices.createUsers(req.body);
        res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    // PUT /users/:user_id — update a user; expects user fields in req.body
    update = async (req, res, next) =>{
        try{
            if(this._validate(req, res)){
            return;
        }

        const data = await this.userServices.updateUsers(req.params.user_id, req.body);
        if(!data){
            return res.status(404).json({message: 'No data found'});
        }
        res.status(201).json(data)
        }catch(e){
            next(e);
        }
    }

    // DELETE /users/:user_id — delete a user
    delete = async (req, res, next) =>{
        try{
            if(this._validate(req, res)){
                return;
            }

            const ok = await this.userServices.deleteUsers(req.params.user_id);
            if(!ok){
                return res.status(404).json('Not found');
            }
            
            res.status(204).send();

        }catch(e){
            next(e);
        }
    }

    // POST /users/login — login with { email, password }
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await this.userServices.loginUser(email, password);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}