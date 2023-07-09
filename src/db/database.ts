import {MongoClient} from "mongodb";

const mongoUri = process.env.mongoURI || "mongodb+srv://daarksky1919:necron23@my-db.t8klcla.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(mongoUri);


const dbName = 'test'
export const blogCollection = client.db(dbName).collection('blogs')
export const postCollection = client.db(dbName).collection('posts')

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