const {time} = require("./src/utils.js")

module.exports = {
	messageWatchers: [
		// capsule initiative
		{
			what: {
				guild: "818616962728722452", // capsule initiative
				messageContent: "cette semaine",
				readDuration: 2 * time.day
			},
			// time is UTC
			// https://crontab.guru/#0_0_*_*_2
			when: "0 0 * * 2",
			who: {
				users: [
					"236239413405810688" // sabri
				],
				channels: [
					"884870609434210434"
				]
			}
		},
		// tests on my own server, please don't modify
		{
			enabled: false,
			what: {
				guild: "484698958359429133", // my own test guild
				messageContent: "",
				readDuration: 1 * time.minute
			},
			when: "* * * * *",
			who: {
				users: [
					"439790095122300928" // jonatjano
				],
				channels: [
					"884870609434210434" // skatebot test channel
				]
			}
		}
	]
}
