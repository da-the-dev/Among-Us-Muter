const Discord = require('discord.js')
const Keyv = require('keyv')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    async (args, msg, client) => {
        if(args[0] == "fix") {
            var keyv = new Keyv(process.env.REDISCLOUD_URL)
            var db = await keyv.get(msg.guild.id)

            if(!db) {
                msg.reply("couldn't find any data related to this server. Try `.register`")
                return
            }
            var roleId = db['muteRoleId']
            if(!roleId) {
                msg.reply('no mute role specified. Try `.addMuteRole @role` first')
                return
            }

            if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR")) || msg.member.roles.cache.find(role => role.id == roleId)) {
                var mentioned = msg.mentions.members.first()
                if(mentioned) {
                    mentioned.voice.setMute(false)
                    msg.reply(`fixed <@${mentioned.user.id}>. Please, don't break the bot`)
                } else {
                    msg.reply("either no user mentioned, or not a user was specified")
                }
            }
        }
    }