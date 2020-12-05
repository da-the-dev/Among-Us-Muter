const Discord = require('discord.js')
const asyncRedis = require('async-redis');
module.exports =
    /**
     * @param {Array<string>} guild Server guild
    */
    async (voiceState1, voiceState2) => {
        if(voiceState1.channelID == voiceState2.channelID)
            return

        const db = asyncRedis.createClient(process.env.REDISCLOUD_URL)
        var data = JSON.parse(await db.get(voiceState1.guild.id))
        if(!data)
            data = JSON.parse(await db.get(voiceState2.guild.id))

        if(!data)
            db.quit()
        if(!data.voiceChannel)
            db.quit()

        // If user leaves 
        if(voiceState1.channelID == data.voiceChannel)
            voiceState2.setMute(false)

        // If user joins
        if(voiceState2.channelID && voiceState2.channelID == data.voiceChannel)
            if(data.isMuted)
                voiceState2.setMute(true)
            else
                voiceState2.setMute(false)

        // If user leaves completely
        if(!voiceState2.channelID && voiceState1.channelID == data.voiceChannel)
            voiceState1.setMute(false)

        db.quit()
    }