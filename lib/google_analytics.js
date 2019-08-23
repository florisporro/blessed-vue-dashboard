const { google } = require("googleapis")

// eslint-disable-next-line camelcase
const { client_email, private_key, viewId } = require("../auth_google.json")
const scopes = "https://www.googleapis.com/auth/analytics.readonly"

const jwt = new google.auth.JWT(client_email, null, private_key, scopes)

async function getData({ metrics, dimensions, filters, month }) {
	const defaultData = {
		auth: jwt,
		ids: `ga:${viewId}`
	}
	await jwt.authorize()
	const result = await google.analytics("v3").data.ga.get({
		...defaultData,
		"start-date": month ? "30daysAgo" : "today",
		"end-date": "today",
		metrics,
		dimensions,
		filters
	})
	return result.data.rows
}

async function getNumber(options) {
	const result = await getData(options)
	if (result && result[0] && result[0][0]) return Number(result[0][0])
	else return 0
}

// Sessions: ga:sessions
// Filter for organic sources: filter: 'ga:medium==organic'
// Browser list: 'ga:browser'
// Display sessions by traffic source: dimensions: 'ga:source'
// Display number of downloads:
// filters: "ga:eventAction==Download now"
// Timeframes: 30daysAgo, today, yesterday

module.exports.getData = getData
module.exports.getNumber = getNumber
