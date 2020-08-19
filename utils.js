import fs from 'fs'

export const checkFileExists = fileName =>
  new Promise(resolve => {
    fs.exists(fileName, exists => {
      if (exists) {
        resolve()
      } else {
        fs.writeFile(
          fileName,
          JSON.stringify(
            {},
            null,
            2,
          ),
          { flag: 'wx' },
          () => {
            resolve()
          },
        )
      }
    })
  })

export default {}