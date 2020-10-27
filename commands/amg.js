const Discord = require('discord.js')
const Keyv = require('keyv')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    async (args, msg, client) => {
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
        var voiceChannelId = db['voiceChannel']
        if(!voiceChannelId) {
            msg.reply('no Among Us voicechannel specified. Try `.addAmongUsChannel <channelid> first`')
            return
        }

        if(msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR')) || msg.member.roles.cache.find(role => role.id == roleId)) {
            /**@type {Discord.VoiceChannel} */
            var voiceChannel = await client.channels.fetch(voiceChannelId)
            if(!db.isMuted) {
                voiceChannel.members.forEach(async m => {
                    m.voice.setMute(true)
                })
                msg.reply('channel muted! SHHHHHHHHH!')
                    .then(msg => {
                        msg.delete({ timeout: 3000 })
                    })
            } else {
                voiceChannel.members.forEach(async m => {
                    m.voice.setMute(false)
                })
                msg.reply('channel un-muted! Speak!')
                    .then(msg => {
                        msg.delete({ timeout: 3000 })
                    })

            }
            db.isMuted = !db.isMuted
            await keyv.set(msg.guild.id, db)
            await msg.delete()
            return
        }
    }