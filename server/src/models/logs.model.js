import { Schema, model } from 'mongoose'

const logsSchema = new Schema({
  service: {
    type: String,
  },
  level: {
    type: String,
  },
  ip: {
    type: String,
  },
  path: {
    type: String,
  },
  status: {
    type: Number,
  },
  message: {
    type: String,
  },
  request: {
    method: {
      type: String,
    },
    url: {
      type: String,
    },
    params: {
      type: Object,
    },
    body: {
      type: Object,
    },
  },
  _createAt: {
    type: Date,
  },
})

logsSchema.index({ service: 1, level: 1, ip: 1, path: 1, status: 1 })

export default model('Logs', logsSchema)
