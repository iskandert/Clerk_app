import dotenv from 'dotenv'
dotenv.config()

const env = process.env

const SERVER = {
  port: env.SERVER_PORT,
}

const MONGO = {
  host: env.MONGO_HOST,
  port: env.MONGO_PORT,
  username: env.MONGO_USERNAME,
  password: env.MONGO_PASSWORD,
  database: env.MONGO_DATABASE,
  get uri() {
    return `mongodb://${this.username}:${this.password}@${this.host}:${this.port}/?authMechanism=DEFAULT`
  },
}

export { SERVER, MONGO }
