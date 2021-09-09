/**
 * This callback is displayed as part of the Requester class.
 * @callback Command~commandReply
 * @param {CommandInteraction} interaction
 * @param {*} reply
 */
// node_modules/discord.js/src/structures/ApplicationCommand.js
module.exports = class Command {
	/**
	 * @param {ApplicationCommandData} command
	 * @param {Command~commandReply} reply
	 */
	constructor(command, reply) {
		this.command = command
		this.reply = reply
	}
}
