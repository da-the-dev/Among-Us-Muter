const Discord = require('discord.js')
const Keyv = require('keyv')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    async (args, msg, client) => {
        if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR"))) {
            if(!args[1]) {
                msg.reply("no voicechannel id specified")
                return
            }
            if(Number.isInteger(Number(args[1]))) {
                var channel = msg.guild.channels.cache.find(channel => channel.id == args[1])
                var keyv = new Keyv(process.env.REDISCLOUD_URL)

                var db = await keyv.get(msg.guild.id)
                db.voiceChannel = args[1]
                await keyv.set(msg.guild.id, db)
                msg.reply(`successfuly added Among Us channel with name \`${channel.name}\`!`)
            }
        }
    }
