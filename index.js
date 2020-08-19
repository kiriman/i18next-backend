import i18next from 'i18next'
import i18nextMiddleware from 'i18next-http-middleware'
import express from 'express'
import FilesystemBackend from 'i18next-fs-backend'
import bodyParser from 'body-parser'
import cors from 'cors'

import writeKeys from './writeKeys'

const app = express()
const router = express.Router()
const port = 8080
const otherOptions = {}

const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(FilesystemBackend)
  .init({ preload: ['en', 'ru'], ...otherOptions }, () => {
    i18nextMiddleware.addRoute(
      i18next,
      '/translation/:lng',
      ['en', 'ru'],
      router,
      'post',
      async (req, res) => {
        const keys = Object.keys(req.body)
        const lng = req.lng.split('-')[0]

        await writeKeys({keys, lng})

        res.send(200);
      }
    ),
      app.use('/', router)
  })

app.use(i18nextMiddleware.handle(i18next))

app.listen(port, () => {
  console.log('Server listening on port', port)
})

