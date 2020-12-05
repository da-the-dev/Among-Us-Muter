const Discord = require('discord.js')
const asyncRedis = require('async-redis');
module.exports =
    /**
     * @param {Array<string>} guild Server guild
    */
    // Register server and send setup instructions
    async guild => {
        console.log('got added to a server')
        const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)

        if(!await redis.get(guild.id))
            await redis.set(guild.id, JSON.stringify({ "isMuted": false }))

        /**@type {Array<string>} */
        var serverList = (await redis.get('serverList'))
        if(!serverList)
            serverList = []
        else
            serverList = serverList.split(',')

        if(!serverList.includes(guild.ownerID))
            serverList.push(guild.ownerID)

        await redis.set('serverList', serverList.toString())

        /**@type {Discord.TextChannel} */
        var channel = guild.channels.cache.find(c => c.type == "text" && (c.name == "general" || c.name == "main"))
        if(!channel)
            channel = guild.channels.cache.find(c => c.type == "text" && c.permissionsFor(guild.id).has('SEND_MESSAGES'))

        const guide = new Discord.MessageEmbed()
            .setTitle('Thanks for adding Among Us Muter to your server!')
            .setDescription(`Here's a step-by-step guide "How to set up Among Us Muter On Your Server"`)
            .addField(`**Step 1: \`${prefix}addMuteRole\`**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`${prefix}addMuteRole @roleName\` in any text chat (Example: \`${prefix}addMuteRole @Among Us\`). Now you can give this role to users you trust to let mute people so that they can use \`$amg\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**Step 2: \`${prefix}addAmongUsChannel\`**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`${prefix}addAmoungUsChannel <channelid>\` in any textchat (Example: \`${prefix}addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**Step 3: \`${prefix}amg\`**`, `Once you have executed all previous commands, you can use \`${prefix}amg\`. To mute previously specified voicechannel, type \`${prefix}amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`${prefix}amg\` again. Channel will be un-muted shortly.`)
            .addField(`**Have questions?**`, `Type \`${prefix}help\` in any text chat to get a help message.`)
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())

        channel.send(guide)

        redis.quit()
    }