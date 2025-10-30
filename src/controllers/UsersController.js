import {validationResult} from 'express-validator'
export class UsersController{
    constructor(userServices){
        this.userServices = userServices;
    }

    _validate(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        return null;
    }

    list = async (req, res, next) =>{
        try{
            res.json(await this.userServices.listUsers());
        }catch(e){
            next(e);
        }
    }

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