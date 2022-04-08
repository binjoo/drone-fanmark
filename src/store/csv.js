const path = require('path')
const dayjs = require('dayjs')
const { constants } = require('fs')
const fs = require('fs/promises')
const fse = require('fs-extra')
const { parseString, writeToString } = require('fast-csv')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
module.exports = class FileStore {
  constructor({ dir }) {
    this.filename = path.join(dir, 'fanfou.csv')
  }

  async parse (data) {
    return new Promise((resolve, reject) => {
      const ret = []
      parseString(data, {
        headers: true,
      })
        .on('error', reject)
        .on('data', (row) => ret.push(row))
        .on('end', () => resolve(ret))
    })
  }

  async stringify (data) {
    return writeToString(data, {
      headers: true,
      writeHeaders: true,
    })
  }

  format (item) {
    for (const i in item) {
      if (item[i] === undefined) delete item[i]
    }

    return item
  }

  async get () {
    const isExist = await fs.access(this.filename, constants.F_OK).then(() => true, () => false)
    const text = isExist ? (await fs.readFile(this.filename, 'utf-8')) : '[]'
    this._data = await this.parse(text)
    return this._data.map(item => ({
      ...item,
      time: dayjs(item.time, 'YYYY-MM-DD HH:mm:ss').valueOf()
    }))
  }

  async set (data) {
    const text = await this.stringify(data.concat(this._data))
    await fse.ensureFile(this.filename)
    return fs.writeFile(this.filename, text, 'utf-8')
  }
}