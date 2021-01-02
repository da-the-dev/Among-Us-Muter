const Discord = require('discord.js')
const messages = require('../messages')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    (args, msg, client) => {
        msg.channel.send(messages.help(client))
    }
