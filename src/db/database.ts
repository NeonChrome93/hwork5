import {MongoClient} from "mongodb";
import {BlogsType} from "../models/blogs-models/blogs-models-database";
import {PostType} from "../models/posts-models/post-models-databse";
import dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URL
if(!mongoUri) {
    throw new Error("mongoUri not found")
}
const client = new MongoClient(mongoUri);


const dbName = 'blogs-posts'
export const blogCollection = client.db(dbName).collection<BlogsType>('blogs')
export const postCollection = client.db(dbName).collection<PostType>('posts')

export async function runDatabase() {
    try {
        await client.connect()
        await client.db('test').command({ping: 1})
        console.log('Connect successfully to Mongo database ')

    } catch {
        console.log('Can not  connect  to Mongo database ')
        await client.close()
    }
}