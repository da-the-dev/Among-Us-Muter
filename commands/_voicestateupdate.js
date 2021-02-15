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

        // Debug setup
        // console.log({
        //     'oldChannel': exists(oldChannel),
        //     'newChannel': exists(newChannel),
        //     'oldChannel in category': exists(oldChannel) && oldChannel.parent == category,
        //     'newChannel in category': exists(newChannel) && newChannel.parent == category
        // })
        // console.log()


        // mute status change
        if(oldState.mute != newState.mute && !(!exists(oldChannel) && exists(newChannel) && newChannel.parent == category)) {
            // console.log('mute status change')
            return
        }
        // Connected
        if((exists(newChannel) && newChannel.parent == category) || (!exists(oldChannel) && exists(newChannel) && newChannel.parent == category)) {
            // console.log('connected')

            var muterRole = newState.guild.roles.cache.find(r => r.name == 'AUM Muter Role')
            var unmutedTagRole = newState.guild.roles.cache.find(r => r.name == 'TAG: Unmuted')

            if(newChannel.members.size == 1) { // Give host roles if the first one
                await newState.member.roles.add(muterRole)
                await newState.member.roles.add(unmutedTagRole)
            } else {
                var mutedTagRole = newState.guild.roles.cache.find(r => r.name == 'TAG: Muted')
                newChannel.members.forEach(m => { // Sync mute status with everyone in the lobby
                    if(m.roles.cache.has(muterRole.id) && m.roles.cache.has(mutedTagRole.id)) {
                        newState.setMute(true)
                    }
                    if(m.roles.cache.has(muterRole.id) && m.roles.cache.has(unmutedTagRole.id)) {
                        newState.setMute(false)
                    }
                })
            }

            // Update room status message with current players
            var roomName = newChannel.name
            var matchHistory = newChannel.guild.channels.cache.find(c => c.name == "match-history" && c.parentID == category.id)
            var roomStatus = matchHistory.messages.cache.find(m => m.embeds[0].title.includes(roomName))
            var newRoomStatus = roomStatus.embeds[0]

            if(roomStatus.embeds[0].description == 'No players in there as of yet') {
                var user = newState.member.nickname
                if(user == null) user = newState.member.user.username
                newRoomStatus.setDescription(`Current players:\n${user}\n`)
            } else {
                var description = roomStatus.embeds[0].description
                var user = newState.member.nickname
                if(user == null) user = newState.member.user.username
                description += user + '\n'
            }

            roomStatus.edit(newRoomStatus)
        }

        // Left/Disconnected
        if((exists(oldChannel) && exists(newChannel) && oldChannel.parent == category && newChannel.parent != category) || (exists(oldChannel) && !exists(newChannel) && oldChannel.parent == category)) {
            var muterRole = oldState.guild.roles.cache.find(r => r.name == 'AUM Muter Role')
            var unmutedTagRole = oldState.guild.roles.cache.find(r => r.name == 'TAG: Unmuted')
            var mutedTagRole = oldState.guild.roles.cache.find(r => r.name == 'TAG: Muted')

            if(oldChannel.members.size != 0 && oldState.member.roles.has('AUM Muter Role')) { // If host leaves give the role to someone else
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

            // Update room status message with current players
            var roomName = oldChannel.name
            var matchHistory = oldChannel.guild.channels.cache.find(c => c.name == "match-history" && c.parentID == category.id)
            var roomStatus = matchHistory.messages.cache.find(m => m.embeds[0].title.includes(roomName))
            var newRoomStatus = roomStatus.embeds[0]

            if(oldChannel.members.size == 0) {
                newRoomStatus.setDescription('No players in there as of yet')
            } else {
                /**@type {string} */
                var description = roomStatus.embeds[0].description
                var user = newState.member.nickname
                if(user == null) user = newState.member.user.username

                var indexOfUser = description.indexOf(user)
                description = description.substr(0, indexOfUser) + description.substr(indexOfUser + user.length, description.length)
            }
            roomStatus.edit(newRoomStatus)
        }
    }