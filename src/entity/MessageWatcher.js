const utils = require("../utils.js")

class MessageWatcherOption {
	guild
	messageContent
	readDuration
	crontab
	reportUsers
	reportChannels
	enabled
	react

	constructor(option) {
		this.guild = option?.what?.guild
		this.messageContent = option?.what?.messageContent?.toLowerCase()
		this.readDuration = option?.what?.readDuration
		this.crontab = option?.when
		this.reportUsers = option?.who?.users
		this.reportChannels = option?.who?.channels
		this.enabled = option.enabled ?? true
		this.react = option.react
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
	 * @type {Date}
	 */
	#nextDate = new Date(0)
	/**
	 * @type {Set<string>}
	 */
	#users = new Set()
	/**
	 * @param {MessageWatcherOption} messageWatcherOption
	 */
	constructor(messageWatcherOption) {
		this.#options = new MessageWatcherOption(messageWatcherOption)
		this.#options.validate()

		this.#loop()
	}

	get enabled() { return this.#options.enabled }
	set enabled(value) { this.#options.enabled = !!value }

	newMessage(message) {
		if (message.guild?.id === this.#options.guild &&
			Date.now() > this.#startDate &&
			message.content.toLowerCase().includes(this.#options.messageContent) &&
			message.author.id !== client.user.id
		) {
			this.#users.add(message.author.id)
			if (this.#options.react) {
				message.react(this.#options.react)
			}
		}
	}

	#loop() {
		this.#timeoutId = setTimeout(() => {
			const messageContent = {content: this.#reportMessage}

			if (this.#options.enabled) {
				for (const reportChannelId of this.#options.reportChannels) {
					client.guilds
						.resolve(this.#options.guild)
						?.channels.fetch(reportChannelId)
						.then(channel => channel.send(messageContent))
				}

				for (const reportUserId of this.#options.reportUsers) {
					client.users
						.fetch(reportUserId)
						.then(user => user.createDM())
						.then(dm => dm.send(messageContent))
				}
			}

			this.#users.clear()

			setTimeout(() => this.#loop(), 1000)
		}, this.#nextCronDate - Date.now())
	}

	isForGuild(guild) {
		if (typeof guild === "string") {
			return this.#options.guild === guild
		} else if (guild.id) {
			return this.#options.guild === guild.id
		}
		return false
	}

	/**
	 * @return {Date}
	 */
	get #nextCronDate() {
		if (this.#nextDate.valueOf() < Date.now()) {
			this.#nextDate = utils.nextCronDate(this.#options.crontab)
		}
		return this.#nextDate
	}

	/**
	 * @return {Date}
	 */
	get #startDate() {
		return new Date(this.#nextCronDate.valueOf() - this.#options.readDuration)
	}

	get #reportMessage() {
		return `During the observation period I've seen messages from :\n${this.#users.size !== 0 ? [...this.#users.values()].map(u => `- <@${u}>`).join("\n") : "- nobody\n#alone\n#silence\n#suicide"}`
	}

	toShortString() {
		return `watches ${this.#options.messageContent.length !== 0 ? `message containing : "\`${this.#options.messageContent}\`"` : "every messages"} and uses crontab configuration : \`${this.#options.crontab}\` ${this.#options.enabled ? "" : "(disabled)"}`
	}

	toString() {
		const nextCronDate = this.#nextCronDate

		return `watches ${this.#options.messageContent.length !== 0 ? `message containing : "\`${this.#options.messageContent}\`"` : "every messages"}
for ${utils.toTimeString(this.#options.readDuration)} before sending a report
(next report read starts ${utils.dateAsDiscordTag(new Date(+nextCronDate - this.#options.readDuration), "R")})

report uses the following crontab configuration : \`${this.#options.crontab}\` (<https://crontab.guru/#${this.#options.crontab.replaceAll(" ", "_")}>)
(next report will be on ${utils.dateAsDiscordTag(nextCronDate)}, ${utils.dateAsDiscordTag(nextCronDate, "R")})

reports are sent${this.#options.reportUsers ? ` to ${this.#options.reportUsers.map(u => `<@${u}>`).join(", ")}
`: ""}${this.#options.reportChannels && this.#options.reportUsers ? "and" : ""}${this.#options.reportChannels ? ` in the channels ${this.#options.reportChannels.map(c => `<#${c}>`).join(", ")}` : ""}

currently ${this.enabled ? "enabled" : "disabled"}`
	}
}
