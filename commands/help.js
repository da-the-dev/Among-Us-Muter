const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    (args, msg, client) => {
        var help = new Discord.MessageEmbed()
            .setTitle('Help menu')
            .setDescription('All AUM commands for admins and others')
            // .addField(`**${client.prefix}register**`, `If AUM has never been used on this server, just type \`${client.prefix}register\` in any text chat. This command can only be run by users who have Administrator permission.`)
            .addField(`**${client.prefix}setup**`, `If you need to refer to a step-by-step guide on how to setup the bot on your server, use this command.`)
            .addField(`**${client.prefix}addMuteRole**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`${client.prefix}addMuteRole @roleName\` in any text chat (Example: \`${client.prefix}addMuteRole @Among Us\`). This command can only be run by users who have Administrator permission.`)
            .addField(`**${client.prefix}addAmongUsChannel**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`${client.prefix}addAmongUsChannel <channelid>\` in any textchat (Example: \`${client.prefix}addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**${client.prefix}amg**`, `Once you have executed all previous commands, you can use \`${client.prefix}amg\`. To mute previously specified voicechannel, type \`${client.prefix}amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`${client.prefix}amg\` again. Channel will be un-muted shortly.`)
            // .addField(`**${client.prefix}fix**`, `If user left Among Us channel when it was muted, type \`${client.prefix}fix @member\` in any text chat (Example: \`${client.prefix}fix @daym bro\`). This will give them back their microphone.`)
            .addField("**GitHub**", "This bot was written by hand using Node.js and discord.js! Want to see how it works? Checkout my github repo [here](https://github.com/da-the-dev/Among-Us-Muter)")
            .addField('**Patreon**', "Love this bot? Consider [donating a few dollans](https://www.patreon.com/da_dev) to help this project grow!")
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
        msg.channel.send(help)
    }
