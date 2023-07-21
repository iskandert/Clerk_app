// import LogsModel from '../models/logs.model.js'
import * as fs from 'fs'
import { oauthOptions } from '../configs/env.config.js'
import Repository from './repository.js'
import { google } from 'googleapis'
const { OAuth2 } = google.auth
const drive = google.drive('v3')

class GDriveRepository extends Repository {
  constructor() {
    super()
  }

  getAppMeta = async (accessToken) => {
    console.log('repo getAppMeta')
    console.log(accessToken)
    console.log(oauthOptions)
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    console.log(oauth2Client)
    try {
      const response = await drive.files.list({
        auth: oauth2Client,
        spaces: 'appDataFolder',
        fields: 'files(id, name)',
        pageSize: 100,
      })
      console.log(response.data)
      return response.data.files
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  deleteAppFile = async (accessToken, { fileId }) => {
    console.log('repo delete files')
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    try {
      const file = await drive.files.delete({
        auth: oauth2Client,
        // spaces: 'appDataFolder',
        fileId,
      })
      console.log('Deleted:', file)
      return { message: 'file deleted' }
    } catch (err) {
      console.log('ERROR')
      console.log(err)
      throw err
    }
  }

  getAppFile = async (accessToken, { fileId }) => {
    console.log('repo files')
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    try {
      const file = await drive.files.get({
        auth: oauth2Client,
        fileId,
        alt: 'media',
      })
      console.log('File:', file)
      return file.data
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  createAppFile = async (accessToken, { fileName, fileData, randomSuffix = true }) => {
    console.log('repo files')
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    const { deleteFile, fileOpts } = await this.createFile(fileData, fileName, randomSuffix)
    try {
      const file = await drive.files.create({
        auth: oauth2Client,
        requestBody: {
          name: fileName,
          parents: ['appDataFolder'],
        },
        media: fileOpts,
        fields: 'id',
      })
      console.log('Created:', file)
      return file.data.id
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      deleteFile()
    }
  }

  updateAppFile = async (accessToken, { fileId, fileData, fileName }) => {
    console.log('repo files')
    const oauth2Client = new OAuth2(...oauthOptions)
    oauth2Client.setCredentials({ access_token: accessToken })
    const { deleteFile, fileOpts } = await this.createFile(fileData, fileName)
    try {
      const resp = await drive.files.update({
        auth: oauth2Client,
        fileId,
        media: fileOpts,
      })
      console.log('Updated:', resp)
      return resp.data
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      deleteFile()
    }
  }
}

export default GDriveRepository
