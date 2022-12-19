import express from 'express';

const app : express.Application  = express();
const port : number = 3333;

app.get('/', (_req : express.Request, _res : express.Response) => {
    const response = {
            code: 200, 
            system: {
                status: 'OK', 
                message: 'All services are running',
                services: {
                    thukolo_bot: {
                        status: 'OK',
                        message: 'No errors found.'
                    },
                    thukolo_api: {
                        status: 'OK',
                        message: 'No errors found.'
                    },
                    thukolo_db: {
                        status: 'OK',
                        message: 'No errors found.'
                    }
                }
            }
        };

    _res.status(response.code).send(response.system);
});

app.listen(port, () => {
    console.log(`API > Listening to port ${port}`)
});