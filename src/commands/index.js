const Command = require("./Command.js")
const utils = require("../utils.js")

/**
 * @type {{[key: string]: Command}}
 */
module.exports = watchers => ({
	// "forget-slash-commands": new Command(
	// 	{
	// 		name: "forget-slash-commands",
	// 		description: "Remove all registered slash commands",
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

	// ping: new Command(
	// 	{
	// 		name: 'ping',
	// 		description: 'A ping command',
	// 		defaultPermission: true
	// 	},
	// 	inter => {
	// 		return inter.reply({ content: "Pong !", ephemeral: true })
	// 	}
	// ),

	watchers: new Command(
		{
			name: "watchers",
			description: "list message watchers for current server",
			defaultPermission: true
		},
		interaction => interaction.reply({
			content: watchers
				.filter(w => w.isForGuild(interaction.guild))
				.map(w => w.toString()).join("\n"),
			ephemeral: true
		})
	)
})
