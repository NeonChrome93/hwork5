import {app} from "./app";
import {runDatabase} from "./db/database";


const port = process.env.PORT || 5000;


//app.get('/products/:title', (req: Request, res : Response) => {
 //   let product = products.find(el => el.title === req.params.title)
 //   if(product) {
//        res.send(product)
//    }
//    else res.send(404)
//})





// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

const startApp = async () => {

    await runDatabase()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};

startApp();