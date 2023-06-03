// import LogsModel from '../models/logs.model.js'
import { google } from 'googleapis'
import * as fs from 'fs'
import { oauthOptions } from '../configs/env.config.js'
const { OAuth2 } = google.auth
const drive = google.drive('v3')

class LogsRepository {
  constructor() {
    this.unique_increment = 0
  }

  getUnique = () => {
    if (this.unique_increment >= 1000000) return (this.unique_increment = 0)
    return ++this.unique_increment
  }

  writeToJSON = async (data) => {
    const jsonData = JSON.stringify(data)
    // Write JSON data to a file with unique name
    const sup_file_name = `./temporary/log_${new Date().toISOString().replace(/[-:\.]/g, '')}.json`
    fs.writeFile(sup_file_name, jsonData, (e) => {
      if (e) throw e
      console.log('end of writing')
    })
  }

  create = async (data) => {
    const log = 'abcdefg'
    console.log('in repo')
    return log
  }

  files = async (accessToken) => {
    console.log('repo files')
    console.log(accessToken)
    // Setting the access token for the OAuth2 client
    // oauth2Client.setCredentials({ access_token: accessToken })
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    let a = JSON.parse(JSON.stringify(oauth2Client))
    try {
      // await this.writeToJSON({ a: 'a' })
      const jsonData = JSON.stringify({ a: 'a' })
      // Write JSON data to a file with unique name
      const sup_file_name = `./temporary/log_${new Date().toISOString().replace(/[-:\.]/g, '')}.json`
      fs.writeFile(sup_file_name, jsonData, (e) => {
        if (e) throw e
        console.log('end of writing')
      })
      console.log('after writing')
      console.log('in try')
      console.log(oauth2Client)
      // Getting of Google Drive files list
      const response = await drive.files.list({
        auth: oauth2Client,
        pageSize: 10,
        fields: 'files(id, name)',
      })
      console.log('after response')
      return response.data.files
    } catch (err) {
      console.log('ERROR ERROR ERROR ERROR ERROR')
      console.error(err)
      throw err
    }
  }

  test = async () => {
    try {
      const jsonData = JSON.stringify({ a: 'a' })
      fs.writeFile('log.json', jsonData, (e) => {
        if (e) throw e
        console.log('end of writing')
      })
      const response = await asyncFunc()
      return response.data.files
    } catch (err) {
      console.log('ERROR ERROR ERROR ERROR ERROR')
      console.error(err)
      throw err
    }
  }

  getAppMeta = async (accessToken) => {
    console.log('repo getAppMeta')
    // oauth2Client.setCredentials({ access_token: accessToken })
    console.log(accessToken)
    console.log(oauthOptions)
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    console.log(oauth2Client)
    try {
      const response = await drive.files.list({
        auth: oauth2Client,
        spaces: 'appDataFolder',
        fields: 'nextPageToken, files(id, name)',
        pageSize: 100,
      })
      console.log(response.data)
      return response.data.files
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  createAppFile = async (accessToken, fileName = 'config.json') => {
    console.log('repo files')
    // Setting the access token for the OAuth2 client
    // oauth2Client.setCredentials({ access_token: accessToken })
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    const data = {
      message: 'Hello, World!',
    }
    const jsonData = JSON.stringify(data)
    // Write JSON data to a file with unique name
    const sup_file_name = `./temporary/config_${this.getUnique()}.json`
    fs.writeFileSync(sup_file_name, jsonData)
    const fileMetadata = {
      name: fileName,
      parents: ['appDataFolder'],
    }
    const media = {
      mimeType: 'application/json',
      body: fs.createReadStream(sup_file_name),
    }
    try {
      const file = await drive.files.create({
        auth: oauth2Client,
        resource: fileMetadata,
        media: media,
        fields: 'id',
      })
      console.log('!!!')
      console.log('!!!')
      console.log('!!!')
      console.log('!!!')
      console.log('!!!')
      console.log('!!!')
      console.log('File:', file)
      return file.data.id
    } catch (err) {
      console.log(err)
      // TODO(developer) - Handle error
      throw err
    } finally {
      fs.unlink(sup_file_name, (err) => {
        if (err) throw err
        console.log('Sup File was deleted')
      })
    }
  }
}

export default LogsRepository
