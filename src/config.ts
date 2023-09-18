import dotenv from "dotenv";
dotenv.config()

export const configKeys = {

    accessTokenPrivateKey: process.env.JWT_SECRET as string
}
