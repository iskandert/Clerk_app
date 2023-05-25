// import LogsModel from '../models/logs.model.js'
import { google } from 'googleapis'
// const { OAuth2 } = google.auth
const drive = google.drive('v3')
import { oauth2Client } from '../configs/env.config.js'

class LogsRepository {
  constructor() {}

  create = async (data) => {
    const log = 'abcdefg'
    console.log('in repo')
    return log
  }

  files = async (accessToken) => {
    console.log('repo files')
    // Setting the access token for the OAuth2 client
    oauth2Client.setCredentials({ access_token: accessToken })
    try {
      // Getting of Google Drive files list
      const response = await drive.files.list({
        auth: oauth2Client,
        pageSize: 10,
        fields: 'files(id, name)',
      })
      return response.data.files
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export default LogsRepository
