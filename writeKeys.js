import fs from 'fs'

import { checkFileExists } from './utils'

export const writeKeys = ({ keys, lng }) =>
  new Promise(async resolve => {
    const localeFile = `${lng}.json`
    const localeFilePath = `./${localeFile}`

    await checkFileExists(localeFilePath)

    const rawdata = fs.readFileSync(localeFile, 'utf8');
    const currentKeys = JSON.parse(rawdata);

    const newKey = keys[0]

    const mergeKeys = (obj, base) => {
      return Object.keys(obj)
        .reduce((clone, key) => {
          key.split('.').reduce((innerObj, innerKey, i, arr) =>
            innerObj[innerKey] = (i+1 === arr.length) ? obj[key] : innerObj[innerKey] || {}, clone)
          return clone;
        }, Object.assign({}, base));
    }

    const nextKeys = mergeKeys({[newKey]: newKey}, currentKeys)

    fs.writeFileSync(
      localeFilePath,
      JSON.stringify(nextKeys, null, 2),
    )

    resolve()
  })

export default writeKeys