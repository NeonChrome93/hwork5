import {usersCollection} from "../../db/database";
import {ObjectId} from "mongodb";
import {UserDbModel, UserViewModel} from "../../models/users-models/user.models";
import {QueryUserPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";

export const usersRepository = {

    async getUsers(pagination: QueryUserPaginationType): Promise<PaginationModels<UserViewModel[]>> {

        const filter = ({
            $or: [
                {login: {$regex: pagination.searchLoginTerm, $options: 'i'}},
                {email: {$regex: pagination.searchEmailTerm, $options: 'i'}}
            ]
        })

        const users = await usersCollection
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .toArray();

        const totalCount = await usersCollection.countDocuments(filter)
        const items = users.map((u) => ({
            id: u._id.toString(),
            login: u.login,
            email: u.email,
            createdAt: u.createdAt,


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
        const user = await usersCollection.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null;
        }
        return user
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },


    async createUser(newUser: UserDbModel) {
        return usersCollection.insertOne({...newUser})
    },

    async deleteUser(id: string): Promise<boolean> {

        try {
            const filter = {_id: new ObjectId(id)}
            const res = await usersCollection.deleteOne(filter)
            return res.deletedCount === 1
        } catch (e) {
            return false
        }

    },
    async deleteAllUsers(): Promise<boolean> {
        // dbLocal.blogs = [];
        await usersCollection.deleteMany({})
        return true
    }
}
