const utils = require("./utils.js")

module.exports = class MessageWatcher {
	#options
	/**
	 * @param {Object} messageWatcherOption
	 *
	 * @param {Object} messageWatcherOption.what What should the watcher observe ?
	 * @param {string} messageWatcherOption.what.guild id of the discord guild to watch
	 * @param {string} messageWatcherOption.what.messageContent only watch message containing this string (case insensitive)
	 * @param {number} messageWatcherOption.what.readDuration the time between the start of the watch and it's end
	 *
	 * @param {string} messageWatcherOption.when When should the watcher report ?
	 * Uses a the crontab syntax to define time (https://crontab.guru)
	 *
	 * @param {Object} messageWatcherOption.who Who should the watcher report to ?
	 * @param {string[]} [messageWatcherOption.who.users] list of ids of users to DM the report to
	 * @param {string[]} [messageWatcherOption.who.channels] list of ids of channel to report in, these channels should be inside the observed guild
	 */
	constructor(messageWatcherOption) {
		this.#options = messageWatcherOption

		this.#start()
	}

	/**
	 * check if the options object is valid, throw if not
	 * @throws {TypeError} if the options object is not valid
	 */
	#validate() {
		if (typeof this.#options !== "object") {
			throw new TypeError("Option is not an object")
		}
	}

	#start() {

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
for ${this.#options.what.readDuration}ms before sending a report
(next report read starts ${utils.dateAsDiscordTag(new Date(+nextCronDate - this.#options.what.readDuration), "R")})

report uses the following crontab configuration : \`${this.#options.when}\` (https://crontab.guru/#${this.#options.when.replaceAll(" ", "_")})
(next report will be on ${utils.dateAsDiscordTag(nextCronDate)}, ${utils.dateAsDiscordTag(nextCronDate, "R")})

reports are sent${this.#options.who.users ? ` to ${this.#options.who.users.map(u => `<@${u}>`).join(", ")}
`: ""}${this.#options.who.channels && this.#options.who.users ? "and" : ""}${this.#options.who.channels ? ` in the channels ${this.#options.who.channels.map(c => `<#${c}>`).join(", ")}` : ""}${! this.#options.who.channels && ! this.#options.who.users ? "nowhere, pls check configuration" : ""}
`
	}
}
