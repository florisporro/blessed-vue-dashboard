const google = require("./google_analytics")
const nucleus = require("./nucleus")
const fs = require("fs")
const moment = require("moment")

const data = {
	activeUsers: {},
	activeUsersToday: 0,
	activeUsers30Days: 0,
	newUsers: {},
	newUsersToday: 0,
	newUsers30Days: 0,
	windowsUsers30Days: 0,
	macUsers30Days: 0,
	errors: {},
	errorsToday: 0,
	errors30Days: 0,
	downloads: [],
	downloadsToday: 0,
	downloads30Days: 0,
	websiteVisitorsToday: 0,
	websiteVisitors30Days: 0,
	organicWebsiteVisitorsToday: 0,
	organicWebsiteVisitors30Days: 0
}

async function poll() {
	const nucleusToday = await nucleus.getData({
		url: "/quickglance"
	})

	data.activeUsersToday = nucleusToday.users
	data.newUsersToday = nucleusToday.installs
	data.errorsToday = nucleusToday.errors

	const nucleus30Days = await nucleus.getData({
		url: "/",
		month: true
	})

	data.activeUsers = nucleus30Days.activeUsers
	data.activeUsers30Days = nucleus30Days.totalNumbers.users

	data.newUsers = nucleus30Days.newUsers
	data.newUsers30Days = nucleus30Days.totalNumbers.installs

	// 	"platforms": [
	// 		{
	// 				"value": "mac",
	// 				"count": 18
	// 		},
	// 		{
	// 				"value": "win32",
	// 				"count": 18
	// 		}
	// ],

	const platforms = (nucleus30Days || {}).platforms || []
	const win = platforms.find(platform => platform.value === "win32")
	const mac = platforms.find(platform => platform.value === "mac")
	data.windowsUsers30Days = win.count
	data.macUsers30Days = mac.count

	const errors = (nucleus30Days || {}).errors || {}
	data.errors = errors

	if (errors) {
		data.errors30Days = Object.values(errors)
			.map(errObj => {
				return Object.values(errObj).reduce((a, b) => a + b, 0)
			})
			.reduce((a, b) => a + b, 0)
	}

	data.downloads = await google.getData({
		month: true,
		dimensions: "ga:date",
		metrics: "ga:totalEvents"
	})

	data.downloadsToday = await google.getNumber({
		metrics: "ga:totalEvents"
	})

	data.downloads30Days = await google.getNumber({
		month: true,
		metrics: "ga:totalEvents"
	})

	data.websiteVisitorsToday = await google.getNumber({
		metrics: "ga:sessions"
	})

	data.websiteVisitors30Days = await google.getNumber({
		month: true,
		metrics: "ga:sessions"
	})

	data.organicWebsiteVisitorsToday = await google.getNumber({
		metrics: "ga:sessions",
		filters: "ga:medium==organic"
	})

	data.organicWebsiteVisitors30Days = await google.getNumber({
		month: true,
		metrics: "ga:sessions",
		filters: "ga:medium==organic"
	})

	const currentDate = moment().format("YYYY-MM-DD")
	fs.writeFileSync(
		`./data/processed_${currentDate}.json`,
		JSON.stringify(data),
		"utf8"
	)
	fs.writeFileSync(
		`./data/raw_${currentDate}.json`,
		JSON.stringify({
			nucleus: {
				nucleusToday,
				nucleus30Days
			},
			google: {
				downloads: data.downloads
			}
		}),
		"utf8"
	)
	return data
}

module.exports.data = data
module.exports.poll = poll
