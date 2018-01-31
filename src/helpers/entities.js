let he = require('he')

let decode = (html) => {
  return he.decode(html)
}

let encode = (html) => {
  return he.encode(html)
}

module.exports = {
  entitiesEncode: encode,
  entitiesDecode: decode
}
