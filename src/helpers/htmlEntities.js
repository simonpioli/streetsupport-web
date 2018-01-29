let he = require('he')
// ToDo: Find out how to actually use the MetalSmith way to register
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
