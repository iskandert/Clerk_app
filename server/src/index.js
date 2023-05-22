import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorHandler from './middlewares/error.middleware.js'
// import mongoose from 'mongoose'
import { SERVER } from './configs/env.config.js'
import logger from './configs/winston.config.js'

import LogsRoute from './routes/logs.route.js'

const MODULES = [new LogsRoute()] //доступные модули

const app = express()

app.use(bodyParser.json())
app.use(cors({ origin: true }))

//подключение модулей (роутов)
MODULES.forEach((module) => {
  app.use('/api', module.router)
})

app.use(errorHandler)

//подключение базы данных MongoDB
// mongoose.set('strictQuery', false)
// mongoose
//   .connect(MONGO.uri, {
//     useNewUrlParser: true,
//     dbName: MONGO.database,
//   })
//   .then(() => logger.info(`MongoDB is connected to port ${MONGO.port}`))
//   .catch(() => logger.error(`MongoDB is not connected`))

app.listen(SERVER.port, (error) => {
  if (!error) console.log(`Server is starting at http://localhost:${SERVER.port}`)
  else console.log(`Server is not starting`)
})
