import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorHandler from './middlewares/error.middleware.js'
import { SERVER } from './configs/env.config.js'

import FilesRoute from './routes/files.route.js'

const MODULES = [new FilesRoute()] //доступные модули

const app = express()

app.use(bodyParser.json())
app.use(cors({ origin: true }))

//подключение модулей (роутов)
MODULES.forEach((module) => {
  app.use('/api', module.router)
})

app.use(errorHandler)

app.listen(SERVER.port, (error) => {
  if (!error) console.log(`Server is starting at http://localhost:${SERVER.port}`)
  else console.log(`Server is not starting`)
})
