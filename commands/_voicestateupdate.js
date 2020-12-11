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
        // console.log(exists(oldChannel), exists(newChannel))

        // Connected
        if(exists(oldChannel) && exists(newChannel)) {
            var category = newState.guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms')
            if(newChannel.parent == category) {
                if(newChannel.members.size == 1) {
                    newState.member.roles.add(newState.guild.roles.cache.find(r => r.name == 'AUM Muter Role'))
                        .catch(e => { console.log(e); return })
                }
            }
        }



        // if(voiceState1.channelID == voiceState2.channelID)
        //     return

        // const db = asyncRedis.createClient(process.env.REDISCLOUD_URL)
        // var data = JSON.parse(await db.get(voiceState1.guild.id))
        // if(!data)
        //     data = JSON.parse(await db.get(voiceState2.guild.id))

        // if(!data)
        //     db.quit()
        // if(!data.voiceChannel)
        //     db.quit()

        // // If user leaves 
        // if(voiceState1.channelID == data.voiceChannel)
        //     voiceState2.setMute(false)

        // // If user joins
        // if(voiceState2.channelID && voiceState2.channelID == data.voiceChannel)
        //     if(data.isMuted)
        //         voiceState2.setMute(true)
        //     else
        //         voiceState2.setMute(false)

        // // If user leaves completely
        // if(!voiceState2.channelID && voiceState1.channelID == data.voiceChannel)
        //     voiceState1.setMute(false)

        // db.quit()
    }