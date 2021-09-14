const utils = require("../utils.js")

class MessageWatcherOption {
	guild
	messageContent
	readDuration
	crontab
	reportUsers
	reportChannels
	enabled

	constructor(option) {
		this.guild = option?.what?.guild
		this.messageContent = option?.what?.messageContent
		this.readDuration = option?.what?.readDuration
		this.crontab = option?.when
		this.reportUsers = option?.who?.users
		this.reportChannels = option?.who?.channels
		this.enabled = this.enabled ?? true
	}

	validate() {
		if (typeof this.guild !== "string") {
			throw new TypeError("guild is not an id")
		}
		return true
	}
}

module.exports = class MessageWatcher {
	/**
	 * @type {MessageWatcherOption}
	 */
	#options
	/**
	 * @type {NodeJS.Timeout}
	 */
	#timeoutId = null
	/**
	 * @param {MessageWatcherOption} messageWatcherOption
	 */
	constructor(messageWatcherOption) {
		this.#options = new MessageWatcherOption(messageWatcherOption)
		this.#options.validate()

		if (messageWatcherOption.enabled) {
			this.start()
		}
	}

	start() {
		if (this.#timeoutId === null && this.#options.validate) {
			this.#loop()
		}
	}

	stop() {
		clearTimeout(this.#timeoutId)
		this.#timeoutId = null
	}

	#loop() {
		this.#timeoutId = setTimeout(() => {
			client.guilds
				.resolve(this.#options.what.guild)
				?.channels.fetch(this.#options.who.channels[0])
					.then(channel => channel.send("watcher report (WIP)"))

			this.#loop()
		}, Number(utils.nextCronDate(this.#options.when)) - Date.now())
	}

	isForGuild(guild) {
		if (typeof guild === "string") {
			return this.#options.what.guild === guild
		} else if (guild.id) {
			return this.#options.what.guild === guild.id
		}
		return false
	}

	get #nextCronDate() {
		const crontabInput = this.#options.when.split(" ")
		return utils.nextCronDate({
			minute: crontabInput[0],
			hour: crontabInput[1],
			day: crontabInput[2],
			month: crontabInput[3],
			dayOfWeek: crontabInput[4]
		})
	}

	toString() {
		const nextCronDate = this.#nextCronDate

		return `watches ${this.#options.what.messageContent.length !== 0 ? `message containing : "\`${this.#options.what.messageContent}\`"` : "every messages"}
for ${utils.toTimeString(this.#options.what.readDuration)} before sending a report
(next report read starts ${utils.dateAsDiscordTag(new Date(+nextCronDate - this.#options.what.readDuration), "R")})

report uses the following crontab configuration : \`${this.#options.when}\` (https://crontab.guru/#${this.#options.when.replaceAll(" ", "_")})
(next report will be on ${utils.dateAsDiscordTag(nextCronDate)}, ${utils.dateAsDiscordTag(nextCronDate, "R")})

reports are sent${this.#options.who.users ? ` to ${this.#options.who.users.map(u => `<@${u}>`).join(", ")}
`: ""}${this.#options.who.channels && this.#options.who.users ? "and" : ""}${this.#options.who.channels ? ` in the channels ${this.#options.who.channels.map(c => `<#${c}>`).join(", ")}` : ""}${! this.#options.who.channels && ! this.#options.who.users ? "nowhere, pls check configuration" : ""}
`
	}
}
