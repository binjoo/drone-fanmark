const { request } = require('undici')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const {
  FANFOU_API_HOST = 'fanfou.com',
  FANFOU_COOKIE,
} = process.env

module.exports = async function fetchSubjects (user, page) {
  var items = []
  const url = `https://${FANFOU_API_HOST}/${user}/p.${page}`

  const { body } = await request(url, {
    headers: {
      host: FANFOU_API_HOST,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
      "cookie": FANFOU_COOKIE,
      referer: 'https://fanfou.com/settings'
    }
  })

  const text = await body.text()
  const $ = cheerio.load(text)
  var lis = $('div#stream li')

  if (lis.length <= 0) {
    return items
  }

  lis.each((i, elem) => {
    var item = {}
    var img = $(elem).find('a.photo')
    if (img.length > 0) {
      let href = img.first().attr('href')
      let hrefAt = href.indexOf('@')
      if (hrefAt > 0) {
        item['photo'] = href.substring(0, hrefAt)
      } else {
        item['photo'] = href
      }
    }
    item['id'] = $(elem).find('.stamp .time').attr('ffid')
    item['content'] = $(elem).find('span.content').text().trim()
    item['time'] = dayjs($(elem).find('.stamp .time').attr('stime')).format("YYYY-MM-DD HH:mm:ss")
    item['url'] = 'https://fanfou.com' + $(elem).find('.stamp .time').attr('href')
    item['source'] = $(elem).find('.stamp .method').text().replace('通过', '')
    items.push(item)
  })

  return items
}
