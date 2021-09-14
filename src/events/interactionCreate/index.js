const Command = require("../../entity/Command.js")
const utils = require("../../utils.js")

/**
 * @type {{[key: string]: Command}}
 */
module.exports = {
	commandInteraction: require("./CommandInteraction/index.js"),
	contextMenuInteraction: require("./ContextMenuInteraction/index.js")
}
