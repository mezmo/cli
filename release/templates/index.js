'use strict'

const path = require('node:path')
const fs = require('node:fs')

module.exports = {
  commit: fs.readFileSync(path.join(__dirname, 'commit.hbs'), 'utf8')
}
