const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: $amg <name>
    */
    async (args, msg, client) => {
        if(msg.member.roles.cache.find(role => role.name == 'AUM Muter Role')) {
            var unmutedTagRole = msg.guild.roles.cache.find(role => role.name == 'TAG: Unmuted')
            var mutedTagRole = msg.guild.roles.cache.find(role => role.name == 'TAG: Muted')

            // If lobby's UNMUTED
            if(msg.member.roles.cache.has(unmutedTagRole.id)) {
                msg.member.voice.channel.members.forEach(async m => {
                    m.voice.setMute(true)
                })
                await msg.member.roles.remove(unmutedTagRole)
                await msg.member.roles.add(mutedTagRole)
                msg.reply('channel muted! SHHHHHHHHH!')
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    })
            }
            // If lobby's MUTED
            if(msg.member.roles.cache.has(mutedTagRole.id)) {
                msg.member.voice.channel.members.forEach(async m => {
                    m.voice.setMute(false)
                })
                await msg.member.roles.remove(mutedTagRole)
                await msg.member.roles.add(unmutedTagRole)
                msg.reply('channel un-muted! Speak!')
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    })
            }
        }
    }