<template>
	<screen ref="screen" :smartCSR="true" :keys="true">
		<!-- LEFT -->
		<bigtext
			content="Today"
			width="37.5%"
			:height="14"
			:left="0"
			:style="{ fg: 'white' }"
		/>
		<Statistic
			label="Active Users"
			:display="activeUsersToday"
			width="20%"
			:height="10"
			:top="14"
		/>
		<Statistic
			label="New Users"
			:display="newUsersToday"
			width="20%"
			:height="10"
			:top="24"
		/>
		<Statistic
			label="Downloads"
			:display="downloadsToday"
			width="20%"
			:height="10"
			:top="34"
		/>
		<Statistic
			label="Website Sessions"
			:display="websiteVisitorsToday"
			width="20%"
			:height="10"
			:top="44"
		/>
		<Statistic
			label="Organic (SEO) Sessions"
			:display="organicWebsiteVisitorsToday"
			width="20%"
			:height="10"
			:top="54"
		/>
		<Statistic
			label="Errors"
			:display="newUsersToday"
			width="20%"
			:height="10"
			:top="64"
			:style="{ bg: 'red' }"
		/>

		<!-- CENTER -->
		<Statistic
			label="Time"
			:display="time"
			width="25%"
			:height="10"
			:top="0"
			left="center"
		/>
		<Statistic
			label="Active Users 30 days"
			:display="activeUsers30Days"
			width="25%"
			:height="10"
			:top="10"
			left="center"
			:style="{ bg: 'blue' }"
		/>
		<gauge
			label="Windows vs Mac"
			width="25%"
			left="center"
			:height="8"
			:top="20"
			:style="boxStyle"
			:border="borderStyle"
			:stack="platformPercentages"
		/>
		<box
			label="Refreshing in"
			width="25%"
			left="center"
			align="center"
			valign="center"
			:height="5"
			:top="28"
			:style="boxStyle"
			:border="borderStyle"
			:content="refreshCountdown.toString()"
		/>
		<box
			label="Refresh error"
			width="25%"
			left="center"
			align="center"
			valign="center"
			:height="5"
			:top="33"
			:style="boxStyle"
			:border="borderStyle"
			:content="error.toString()"
		/>
		<box
			label="Refreshing"
			width="25%"
			left="center"
			align="center"
			valign="center"
			:height="5"
			:top="38"
			:style="boxStyle"
			:border="borderStyle"
			:content="refreshing.toString()"
		/>

		<!-- RIGHT -->
		<bigtext
			content="30 days"
			:width="63"
			:height="14"
			left="100%-63"
			:style="{ fg: 'white' }"
		/>
		<Statistic
			label="Active Users"
			:display="activeUsers30Days"
			width="20%"
			:right="0"
			:height="10"
			:top="14"
		/>
		<Statistic
			label="New Users"
			:display="newUsers30Days"
			width="20%"
			:right="0"
			:height="10"
			:top="24"
		/>
		<Statistic
			label="Downloads"
			:display="downloads30Days"
			width="20%"
			:right="0"
			:height="10"
			:top="34"
		/>
		<Statistic
			label="Website Sessions"
			:display="websiteVisitors30Days"
			width="20%"
			:right="0"
			:height="10"
			:top="44"
		/>
		<Statistic
			label="Organic (SEO) Sessions"
			:display="organicWebsiteVisitors30Days"
			width="20%"
			:right="0"
			:height="10"
			:top="54"
		/>
		<Statistic
			label="Errors"
			:display="newUsers30Days"
			width="20%"
			:right="0"
			:height="10"
			:top="64"
			:style="{ bg: 'red' }"
		/>
	</screen>
</template>

<script>
// import { EventBus } from "./EventBus.js"
import { poll, data } from "../lib/collectData"
import Statistic from "./components/Statistic.vue"
import moment from "moment"

export default {
	data() {
		return {
			...data,
			activeControl: "Menu",
			time: "",
			refreshCountdown: 0,
			error: false,
			refreshing: false
		}
	},
	components: {
		Statistic
	},
	watch: {},
	computed: {
		boxStyle() {
			return {
				border: { fg: "green" },
				fg: "white",
				bold: true
			}
		},
		borderStyle() {
			return {
				type: "line",
				fg: "white",
				color: "white"
			}
		},
		platformPercentages() {
			return [
				{
					percent: Math.round(
						(this.windowsUsers30Days /
							(this.macUsers30Days + this.windowsUsers30Days)) *
							100
					),
					stroke: "blue"
				},
				{
					percent: Math.round(
						(this.macUsers30Days /
							(this.macUsers30Days + this.windowsUsers30Days)) *
							100
					),
					stroke: "white"
				}
			]
		}
	},
	methods: {
		poll() {
			this.refreshing = true
			poll()
				.then(result => {
					Object.keys(result).forEach(key => {
						this.$set(this, key, result[key])
					})
					this.error = false
					this.refreshing = false
					this.refreshCountdown = 3600
				})
				.catch(error => {
					this.error = error
					this.refreshing = false
					this.refreshCountdown = 3600
				})
		}
	},
	mounted() {
		this.$refs.screen.key(["C-c"], () => {
			process.exit(0)
		})
		setInterval(() => {
			if (this.refreshCountdown !== 0) this.refreshCountdown--
		}, 1000)
		setInterval(this.poll, 3600 * 1000)
		setInterval(() => {
			this.time = moment().format("HH:mm:ss")
		}, 1000)
		this.poll()
	}
}
</script>
