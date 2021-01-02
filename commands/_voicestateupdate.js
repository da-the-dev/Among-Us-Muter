const Discord = require('discord.js')
const exists = (v) => {
    if(v)
        return true
    else
        return false
}
module.exports =
    /**
     * @param {Discord.VoiceState} newState The voice state before the update
     * @param {Discord.VoiceState} oldState The voice state after the update
    */
    async (oldState, newState) => {
        /**@type {Discord.VoiceChannel} */
        let oldChannel = oldState.channel
        /**@type {Discord.VoiceChannel} */
        let newChannel = newState.channel
        /**@type {Discord.CategoryChannel} */
        var category = newState.guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms')

        // console.log({
        //     'oldChannel': exists(oldChannel),
        //     'newChannel': exists(newChannel),
        //     'oldChannel in category': exists(oldChannel) && oldChannel.parent == category,
        //     'newChannel in category': exists(newChannel) && newChannel.parent == category
        // })
        // console.log()

        // mute status change
        if(oldState.mute != newState.mute) {
            // console.log('mute status change')
            return
        }
        // Connected
        if(exists(newChannel) && newChannel.parent == category) {
            // console.log('connected')

            var muterRole = newState.guild.roles.cache.find(r => r.name == 'AUM Muter Role')
            var unmutedTagRole = newState.guild.roles.cache.find(r => r.name == 'TAG: Unmuted')

            if(newChannel.members.size == 1) {
                await newState.member.roles.add(muterRole)
                await newState.member.roles.add(unmutedTagRole)
            }
        }

        // Left/Disconnected
        if((exists(oldChannel) && exists(newChannel) && oldChannel.parent == category && newChannel.parent != category) || (exists(oldChannel) && !exists(newChannel) && oldChannel.parent == category)) {
            // console.log('left/disconnected')

            var muterRole = oldState.guild.roles.cache.find(r => r.name == 'AUM Muter Role')
            var unmutedTagRole = oldState.guild.roles.cache.find(r => r.name == 'TAG: Unmuted')
            var mutedTagRole = oldState.guild.roles.cache.find(r => r.name == 'TAG: Muted')

            if(oldChannel.members.size != 0) {
                /**@type {Discord.GuildMember} */
                var newLead = oldChannel.members.first()
                await newLead.roles.add(muterRole)

                if(oldState.member.roles.cache.has(unmutedTagRole.id))
                    await newLead.roles.add(unmutedTagRole)
                if(oldState.member.roles.cache.has(mutedTagRole.id))
                    await newLead.roles.add(mutedTagRole)
            }

            // Remove all AUM-related roles
            if(oldState.member.roles.cache.has(muterRole.id))
                await oldState.member.roles.remove(muterRole)
            if(oldState.member.roles.cache.has(unmutedTagRole.id))
                await oldState.member.roles.remove(unmutedTagRole)
            if(oldState.member.roles.cache.has(mutedTagRole.id))
                await oldState.member.roles.remove(muterRole)
        }
    }