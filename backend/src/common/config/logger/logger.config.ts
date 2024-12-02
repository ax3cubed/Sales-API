import { pino } from "pino";
const fileTransport = pino.transport({
   
    targets:[
        {
            level: 'trace',
            target: 'pino/file',
            options: {
              destination: `${__dirname}/app.log`,
              colorize: true
            },
          },
          {
            level: 'trace',
            target: 'pino-pretty',
            options: {
              colorize: true
            }
          },
    ],
     
})
export const logger = pino(fileTransport);

 
