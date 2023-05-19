import winston from 'winston'

const log = (data) => {
  const { level, message, timestamp, service } = data
  return `${level}: ${message}`
}

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.json()),
  defaultMeta: { service: 'expressApi' },
  transports: [
    // new winston.transports.File({
    //   level: 'error',
    //   filename: './logs/errors.log',
    //   format: winston.format.simple(),
    // }),
    new winston.transports.Console({
      level: 'debug',
      // format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf(myFormat)),
      format: winston.format.combine(winston.format.colorize(), winston.format.printf(log)),
    }),
  ],
  // transports: [new winston.transports.File({ filename: './logs/error.log', level: 'error' }), new winston.transports.File({ filename: './logs/info.log', level: 'info' }), new winston.transports.Console(), new Http(myFormat)],
})

export default logger
