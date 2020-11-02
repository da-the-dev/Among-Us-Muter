const Discord = require('discord.js')
const asyncRedis = require('async-redis');
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    async (args, msg, client) => {
        const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)
        var db = JSON.parse(await redis.get(msg.guild.id))

        if(!db) {
            msg.reply(`couldn't find any data related to this server. Try \`${client.prefix}register\``)
            redis.quit()
            return
        }
        var roleId = db['muteRoleId']
        if(!roleId) {
            msg.reply(`no mute role specified. Try \`${client.prefix}addMuteRole @role\` first`)
            redis.quit()
            return
        }
        var voiceChannelId = db['voiceChannel']
        if(!voiceChannelId) {
            msg.reply(`no Among Us voicechannel specified. Try \`${client.prefix}addAmongUsChannel <channelid> first\``)
            redis.quit()
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
                        msg.delete({ timeout: 5000 })
                    })
            } else {
                voiceChannel.members.forEach(async m => {
                    m.voice.setMute(false)
                })
                msg.reply('channel un-muted! Speak!')
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    })

            }
            db.isMuted = !db.isMuted
            await redis.set(msg.guild.id, JSON.stringify(db))
            await msg.delete()
            redis.quit()
            return
        }
    }