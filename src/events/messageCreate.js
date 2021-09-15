const activeUsers = []

module.exports = watchers => message => {
	if (message.content === "<@!727636604692332616>" || message.content === "<@727636604692332616>") {
		return message.guild.commands.set([
			...Object.values(interactions.commandInteraction).map(command => command.command),
			...Object.values(interactions.contextMenuInteraction).map(command => command.command)
		])
			.then(result => message.reply("registered slash commands for current guild"))
	}

	if (message.content === "watchers") {
		return message.reply(watchers
			.filter(w => w.isForGuild(message.guild))
			.map(w => w.toString()).join("\n"))
	}

	watchers.forEach(w => w.newMessage(message))
}
