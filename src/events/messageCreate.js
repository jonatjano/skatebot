const {exec} = require("child_process");

module.exports = message => {
	watchers.forEach(w => w.newMessage(message))

	if (message.content === "<@!727636604692332616>" || message.content === "<@727636604692332616>") {
		return message.guild.commands.set([
			...Object.values(interactions.commandInteraction).map(command => command.command),
			...Object.values(interactions.contextMenuInteraction).map(command => command.command)
		])
			.then(result => message.reply("registered slash commands for current guild"))
	}

	if (message.author.id === "439790095122300928" && message.content === "bot upgrade") {
		return new Promise((res, rej)  => {
			exec("git pull", (error, stdout, stderr) => {
				if (error) {
					return rej({error, stderr})
				}
				res(stdout)
			})
		})
			.then(out => console.log(out))
			.then(message.react("✅"))
			.catch((err, stderr) => console.error(err) || console.error(stderr))
			.finally(() => { process.exit(1) })
	}
}
