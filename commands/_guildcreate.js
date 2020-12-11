const Discord = require('discord.js')
const asyncRedis = require('async-redis');
module.exports =
    /**
     * @param {Discord.Guild} guild Server guild
    */
    // Register server and send setup instructions
    async (guild, client) => {
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
            .addField(`**Step 1: \`$addMuteRole\`**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`$addMuteRole @roleName\` in any text chat (Example: \`$addMuteRole @Among Us\`). Now you can give this role to users you trust to let mute people so that they can use \`$amg\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**Step 2: \`$addAmongUsChannel\`**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`$addAmoungUsChannel <channelid>\` in any textchat (Example: \`$addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**Step 3: \`$amg\`**`, `Once you have executed all previous commands, you can use \`$amg\`. To mute previously specified voicechannel, type \`$amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`$amg\` again. Channel will be un-muted shortly.`)
            .addField(`**Have questions?**`, `Type \`$help\` in any text chat to get a help message.`)
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())

        channel.send(guide)

        // // Set up lobby for rooms
        // if(!guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms'))
        //     guild.channels.create('Among Us rooms', { type: 'category' })

        // // Create muter role
        // guild.roles.create({
        //     data: {
        //         name: 'AUM Muter Role',
        //         color: '#b50005',
        //     },
        //     reason: "Required to properly use Among Us Muter bot"
        // })

        redis.quit()
    }