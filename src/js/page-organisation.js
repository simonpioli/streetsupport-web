// Common modules
import './common'

// Page modules
var urlParameter = require('./get-url-parameter')
var accordion = require('./accordion')
var htmlEncode = require('htmlencode')
var socialShare = require('./social-share')
var sortBy = require('lodash/collection/sortBy')
var forEach = require('lodash/collection/forEach')
var apiRoutes = require('./api')
var getApiData = require('./get-api-data')
var Spinner = require('spin.js')
var analytics = require('./analytics')
var templating = require('./template-render')

// Spinner
var spin = document.getElementById('spin')
var loading = new Spinner().spin(spin)

var theOrganisation = urlParameter.parameter('organisation')
var organisationUrl = apiRoutes.organisation += theOrganisation

// Get API data using promise
getApiData.data(organisationUrl).then(function (result) {
  var data = result.data
  // Get organisation name and edit page title
  var theTitle = htmlEncode.htmlDecode(data.name + ' - Street Support')
  document.title = theTitle

  data.providedServices = sortBy(data.providedServices, function (item) {
    return item.name
  })


  data.formattedTags = []
  forEach(data.tags, function (tag) {
    data.formattedTags.push({ id: tag, name: tag.replace(/-/g, ' ')})
  })

  forEach(data.providedServices, function (provider) {
    if (provider.tags !== null) {
      provider.tags = provider.tags.join(', ')
    }
  })

  // Append object name for Hogan
  var theData = { organisation: data }

  var callback = function () {
    accordion.init()
    loading.stop()
    analytics.init(theTitle)
    socialShare.init()
  }

  templating.renderTemplate('js-organisation-tpl', theData, 'js-organisation-output', callback)
})
