import dotenv from 'dotenv'
import { google } from 'googleapis'
const { OAuth2 } = google.auth
dotenv.config()

const env = process.env

const SERVER = {
  port: env.SERVER_PORT,
}

// Настройки OAuth2 клиента
const APP_GDATA = {
  id: env.CLIENT_ID,
  secret: env.CLIENT_SECRET,
  redirect: env.REDIRECT_URI,
}

// Авторизация с использованием OAuth2
// const oauth2Client = new OAuth2(APP_GDATA.id, APP_GDATA.secret, APP_GDATA.redirect)
const oauthOptions = [APP_GDATA.id, APP_GDATA.secret, APP_GDATA.redirect]

const MONGO = {}

export {
  //
  SERVER,
  MONGO,
  APP_GDATA,
  // oauth2Client,
  oauthOptions,
}
