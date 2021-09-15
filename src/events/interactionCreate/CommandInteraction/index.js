const Command = require("../../../entity/Command.js")

/**
 * @type {{[key: string]: Command}}
 */
module.exports = {
	watchers: new Command(
		{
			name: "watchers",
			description: "info about watchers for current server",
			// type: "CHAT_INPUT",
			options: [{
				type: "SUB_COMMAND",
				name: "list",
				description: "Show the list of watchers for this server",
				options: []
			},{
				type: "SUB_COMMAND",
				name: "info",
				description: "Show detailed info about the watcher",
				options: [{
					type: "INTEGER",
					name: "watcher_id",
					description: "The id of the watcher you want info of, use /watchers to get list of ids for this server",
					required: true
				}]
			},{
				type: "SUB_COMMAND",
				name: "toggle",
				description: "Toggle on or off the designed watcher",
				options: [{
					type: "INTEGER",
					name: "watcher_id",
					description: "The id of the watcher, use /watchers to get list of ids for this server",
					required: true
				},{
					type: "BOOLEAN",
					name: "on_off",
					description: "True to enable the watcher, false to disable it (default: true)"
				}]
			}],
			defaultPermission: true
		},
		interaction => {
			const guildWatcher = watchers.filter(w => w.isForGuild(interaction.guild))
			let watcherId, state
			switch (interaction.options.getSubcommand(false)) {
				case "list":
					return interaction.reply({
						content: guildWatcher
							.map((w,i) => `- ${i} : ${w.toShortString()}`)
							.join("\n"),
						ephemeral: true
					})
				case "info":
					watcherId = interaction.options.getInteger("watcher_id", false)
					if (! guildWatcher[watcherId]) {
						return interaction.reply({
							content: `watcher_id (${watcherId}) is out of range, use /${interaction.commandName} list, to get a list of watchers`,
							ephemeral: true
						})
					}
					return interaction.reply({
						content: guildWatcher.toString(),
						ephemeral: true
					})
				case "toggle":
					watcherId = interaction.options.getInteger("watcher_id", false)
					state = interaction.options.getBoolean("on_off", false) ?? true
					if (! guildWatcher[watcherId]) {
						return interaction.reply({
							content: `watcher_id (${watcherId}) is out of range, use /${interaction.commandName} list, to get a list of watchers`,
							ephemeral: true
						})
					}
					guildWatcher[watcherId].enabled = state
					return interaction.reply({
						content: `Successfully updated state of watcher to ${guildWatcher[watcherId].enabled ? "enabled" : "disabled"}`,
						ephemeral: true
					})
				default:
					return interaction.reply({
						content: "You used an invalid sub-command, I don't know how you did, but please, reconsider your life choices",
						ephemeral: true
					})
			}

		}
	),
	// "forget-slash-commands": new Command(
	// 	{
	// 		name: "forget-slash-commands",
	// 		description: "Remove all locally registered slash commands",
	// 		defaultPermission: true
	// 	},
	// 	interaction =>
	// 		interaction.guild.commands.set([])
	// 			.then(result => interaction.reply({ content: "Forgot slash commands for current guild", ephemeral: true }))
	// ),

	// "next-cron-time": new Command(
	// 	{
	// 		name: "next-cron-time",
	// 		description: "Return the date of the next time a crontab would execute given the crontab expression",
	// 		defaultPermission: true,
	// 		options: [{
	// 			name: "crontab-expression",
	// 			description: "the crontab expression used to find the date https://crontab.guru/",
	// 			type: "STRING",
	// 			required: true
	// 		}]
	// 	},
	// 	interaction => {
	// 		const crontabExpression = interaction.options.getString("crontab-expression")
	// 		const input = crontabExpression.split(" ")
	// 		const objInput = {
	// 			minute: input[0],
	// 			hour: input[1],
	// 			day: input[2],
	// 			month: input[3],
	// 			dayOfWeek: input[4]
	// 		}
	// 		try {
	// 			return interaction.reply({ content: utils.nextCronDate(objInput).toUTCString(), ephemeral: true })
	// 		} catch (e) {
	// 			return interaction.reply({ content: e.message, ephemeral: true })
	// 		}
	// 	}
	// ),

	ping: new Command(
		{
			name: 'ping',
			description: 'A ping command',
			defaultPermission: true
		},
		inter => {
			return inter.reply({ content: "Pong !", ephemeral: true })
		}
	),
}
