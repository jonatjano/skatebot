// https://discord.com/oauth2/authorize?client_id=727636604692332616&scope=bot+applications.commands&permissions=0

const { Client, Intents, CommandInteraction} = require('discord.js');

const messageCreate = require("./src/events/messageCreate.js")
const MessageWatcher = require("./src/MessageWatcher.js")
const config = require("./config.js")
/**
 * @type {MessageWatcher[]}
 */
const watchers = []
const slashCommands = require("./src/commands/index.js")(watchers)

const client = new Client({intents: [
	Intents.FLAGS.GUILDS,
	// Intents.FLAGS.GUILD_MEMBERS, // allows memberJoin and memberLeave events, if needed please ask @jonatjano#0669 to activate in discord dev portal
	Intents.FLAGS.GUILD_BANS,
	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Intents.FLAGS.GUILD_INTEGRATIONS,
	Intents.FLAGS.GUILD_WEBHOOKS,
	Intents.FLAGS.GUILD_INVITES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_MESSAGE_TYPING,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGE_TYPING
]});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.application.commands.set(
		Object.values(slashCommands).map(command => command.command)
	)

	watchers.push(...config.messageWatchers.map(watcherOptions => new MessageWatcher(watcherOptions)))
});

client.on("messageCreate", messageCreate(watchers));

client.on('interactionCreate', async interaction => {
	if (interaction instanceof CommandInteraction) {
		return slashCommands[interaction.commandName].reply(interaction)
	}
});

client.login(process.env.BOT_TOKEN);
