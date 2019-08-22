const axios = require("axios")
const moment = require("moment")

const { appId, token } = require("../auth_nucleus.json")

const baseUrl = `https://nucleus.sh/app/${appId}/analytics`

async function getData({ url, month }) {
	const request = {
		headers: { Authorization: token }
	}

	if (month) {
		const utcOffset = 120
		const now = moment().unix()
		const monthAgo = moment()
			.subtract(30, "days")
			.unix()
		request.params = {
			start: monthAgo,
			end: now,
			utcOffset
		}
	}

	const { data } = await axios.get(baseUrl + url, request)
	return data
}

module.exports.getData = getData
