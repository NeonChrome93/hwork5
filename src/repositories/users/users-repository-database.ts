//import {usersCollection} from "../../db/database";
import {ModifyResult, ObjectId} from "mongodb";
import { UserViewModel} from "../../models/users-models/user.models";
import {QueryUserPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";
import {randomUUID} from "crypto";
import {UserDbModel, UserModel} from "../../domain/entities/users-entity";

export const usersRepository = {

    async getUsers(pagination: QueryUserPaginationType): Promise<PaginationModels<UserViewModel[]>> {

        const filter = ({
            $or: [
                {login: {$regex: pagination.searchLoginTerm, $options: 'i'}},
                {email: {$regex: pagination.searchEmailTerm, $options: 'i'}}
            ]
        })

        const users = await UserModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await UserModel.countDocuments(filter).exec()
        const items = users.map((u) => ({
            id: u._id.toString(),
            login: u.login,
            email: u.email,
            createdAt: u.createdAt.toISOString()


        }))
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    },


    async readUserById(id: string): Promise<UserDbModel | null> {
        const user :UserDbModel | null = await UserModel.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null;
        }
        return user
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbModel | null>{
        return UserModel.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },

    async findUserByRecoveryCode(recoveryCode: string): Promise<UserDbModel | null> {
        const user :UserDbModel | null = await UserModel.findOne({ passwordRecoveryCode: recoveryCode});
        if (!user) {
            return null;
        }
        return user
    },

    async createUser(newUser: UserDbModel)  {
        return UserModel.create({...newUser})
    },

    async saveUser(newUser: UserDbModel) {
        const user = new UserModel(newUser)
        await user.save()
        return user
    },

    async deleteUser(id: string): Promise<boolean> {

        try {
            const filter = {_id: new ObjectId(id)}
            const res = await UserModel.deleteOne(filter).exec()
            return res.deletedCount === 1
        } catch (e) {
            return false
        }

    },
    async deleteAllUsers(): Promise<boolean> {
        // dbLocal.blogs = [];
        await UserModel.deleteMany({})
        return true
    },


    async readUserByCode(code: string): Promise<UserDbModel | null> {
        const user :UserDbModel | null = await UserModel.findOne({confirmationCode: code});
        if (!user) {
            return null;
        }
        return user
    },

    async confirmEmail(id: string): Promise<void> {
        await UserModel.updateOne({_id: new ObjectId(id)}, {$set: {isConfirmed: true}});
        return;
    },


    async readUserByEmail(email: string): Promise<UserDbModel | null> {
        const user: UserDbModel | null = await UserModel.findOne({email: email});
        if (!user) {
            return null;
        }
        return user
    },

    async readUserByRecoveryCode(email: string): Promise<UserDbModel | null> {
        const user: UserDbModel | null = await UserModel.findOne({email: email});
        if (!user) {
            return null;
        }
        return user
    },

    async updateConfirmationCode(id: string, newCode: string): Promise<any> {
        return UserModel.updateOne({_id: new ObjectId(id)},
            {$set: {confirmationCode: newCode}},);
    },




}
