import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

class Repository {
  constructor() {
    this.unique_increment = 0
  }

  writeTempFile = async (data, prefix, random) => {
    const jsonData = JSON.stringify(data)
    // Write JSON data to a file with unique name
    let sup_file_name = `./temporary/${prefix}_${uuidv4()}.json`
    // let sup_file_name = `./temporary/${prefix}.json`
    // if (random) sup_file_name = `./temporary/${prefix}_${uuidv4()}.json`
    try {
      await fs.promises.writeFile(sup_file_name, jsonData)
      // console.log(sup_file_name)
      return sup_file_name
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  deleteTempFile = (name) => {
    fs.unlink(name, (err) => {
      if (err) return console.log(err)
      console.log(`File ${name} was deleted`)
    })
  }

  createFile = async (data, fileName, random) => {
    const sup_file_name = await this.writeTempFile(data, fileName.split('.')[0], random)
    console.log(sup_file_name)
    const fileOpts = {
      mimeType: 'application/json',
      body: fs.createReadStream(sup_file_name),
    }
    return {
      deleteFile: () => this.deleteTempFile(sup_file_name),
      fileOpts,
    }
  }
}

export default Repository
