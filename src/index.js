const { configParser, exec } = require('./plugin');
configParser({
  id: {
    usage: '饭否 ID',
    env: 'FANFOU_ID'
  },
  format: {
    usage: '存储数据格式，可选值：csv, json',
    env: 'FANFOU_FORMAT',
    def: 'json'
  },
  dir: {
    usage: '记录存储目录',
    env: 'FANFOU_DIR',
    def: './'
  }
})(exec);