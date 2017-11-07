import '../../../common'

const apiRoutes = require('../../../api')
const browser = require('../../../browser')
const getApiData = require('../../../get-api-data')
const getUrlParams = require('../../../get-url-parameter')
import listToSelect from '../../../list-to-dropdown'
const locationSelector = require('../../../location/locationSelector')
const templating = require('../../../template-render')

import { formatNeeds } from '../../../models/give-help/requests/needs'
import { buildList, initAutoComplete } from '../../../models/give-help/requests/listing'
import { PostcodeProximity } from '../../../components/PostcodeProximity'

const redirectForLegacyNeedDetails = () => {
  const cardId = getUrlParams.parameter('id').replace('/', '')
  if (cardId) {
    browser.redirect(`request?id=${cardId}`)
  }
}

const renderNeeds = (data, userLocation, currRange) => {
  console.log('Top of render')
  console.log(data)
  const theData = {
    card: data.items,
    paging: data.links,
    location: userLocation.name,
    postcode: userLocation.postcode,
    categoryName: 'requests for help',
    geoLocationUnavailable: userLocation.geoLocationUnavailable
  }

  const defaultCallback = () => {
    const postcodeProximityComponent = new PostcodeProximity(currRange, (newLocationResult, newRange) => { //eslint-disable-line
      init(newLocationResult, newRange)
    })
    browser.loaded()
  }

  console.log(data)

  if (data.items.length === 0) {
    templating.renderTemplate('js-no-data-tpl', theData, 'js-card-list-output', defaultCallback)
  } else {
    console.log('Here')
    templating.renderTemplate('js-card-list-tpl', theData, 'js-card-list-output', () => {
      buildList()
      redirectForLegacyNeedDetails()
      listToSelect.init()
      initAutoComplete(data.needs)
      defaultCallback()
    })
  }
}

let buildUrl = (userLocation, range = 10000, start, limit) => {
  return `${apiRoutes.needsHAL}?longitude=${userLocation.longitude}&latitude=${userLocation.latitude}&range=${range}&start=${start}&limit=${limit}`
}

const init = function (userLocation, range = 10000) {
  let url = buildUrl(userLocation, range, 0, 9)
  getApiData.data(url)
    .then((result) => {
    console.log(result)
      const formatted = formatNeeds(result.data, userLocation)
      renderNeeds(formatted, userLocation, range)
    }, () => {
      console.log('Fail')
      browser.redirect('/500')
    })
}

browser.loading()
locationSelector
  .getPreviouslySetPostcode()
  .then((result) => {
    init(result)
  }, (_) => {

  })
