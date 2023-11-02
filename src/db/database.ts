
import dotenv from 'dotenv'

import mongoose from 'mongoose'
dotenv.config()

//const client = new MongoClient(mongoUri);




const dbName = 'blogs-posts'
//сделать схему + модель
// export const blogCollection = client.db(dbName).collection<BlogsType>('blogs')
// export const postCollection = client.db(dbName).collection<PostType>('posts')
// export const usersCollection = client.db(dbName).collection<UserDbModel>( 'users')
// export const commentsCollection = client.db(dbName).collection<CommentsDBType>( 'comments')
// export const requestApiCollection = client.db(dbName).collection<{ ip: string, URL: string, date: Date }>( 'requestApi')
// export const devicesCollection = client.db(dbName).collection<DevicesDBType>( 'devices')


export async function runDatabase() {
    try {
        // await client.connect()
        // await client.db('test').command({ping: 1})

        const mongoUri = process.env.MONGO_URL
        if(!mongoUri) {
            throw new Error("mongoUri not found")
        }
        await mongoose.connect(mongoUri, {dbName} )
        console.log('Connect successfully to Mongo database ')

    } catch {
        console.log('Can not  connect  to Mongo database ')
        //await client.close()
        await mongoose.disconnect()
    }
}