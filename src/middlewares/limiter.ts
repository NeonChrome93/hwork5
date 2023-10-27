import {Request, Response, NextFunction} from "express";
import {ApiModel} from "../domain/entities/api-entity";


//import {requestApiCollection} from "../db/database";

const MAX_REQUESTS_PER_ENDPOINT = 5;


export const countApiRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const filter = {
            ip: req.ip,
            URL: req.method + req.baseUrl + req.originalUrl,
            date: { $gte: new Date(Date.now() - 10000) }
        };
        console.log(filter.URL)
        const count = await ApiModel.countDocuments(filter);
        //добавить логику записи в БД
        const requestData = {
            ip: req.ip,
            URL: req.method + req.baseUrl + req.originalUrl,
            date: new Date()
        };
        await ApiModel.create(requestData);

        if(count >= MAX_REQUESTS_PER_ENDPOINT) {
           return  res.sendStatus(429)
        } else {
            next();
        }


    } catch (err) {
        console.error('Ошибка при подсчете документов:', err);
        res.sendStatus(500);
    }
};