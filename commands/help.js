const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    (args, msg, client) => {
        if(args[0] == "help") {
            var help = new Discord.MessageEmbed()
                .setTitle('Help menu')
                .setDescription('All AUM commands for admins and others')
                .addField(`**${prefix}register**`, `If AUM has never been used on this server, just type \`${prefix}register\` in any text chat. This command can only be run by users who have Administrator permission.`)
                .addField(`**${prefix}addMuteRole**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`${prefix}addMuteRole @roleName\` in any text chat (Example: \`${prefix}addMuteRole @Among Us\`). This command can only be run by users who have Administrator permission.`)
                .addField(`**${prefix}addAmongUsChannel**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`${prefix}addAmoungUsChannel <channelid>\` in any textchat (Example: \`${prefix}addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
                .addField(`**${prefix}amg**`, `Once you have executed all previous commands, you can use \`${prefix}amg\`. To mute previously specified voicechannel, type \`${prefix}amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`${prefix}amg\` again. Channel will be un-muted shortly.`)
                .addField(`**${prefix}fix**`, `If user left Among Us channel when it was muted, type \`${prefix}fix @member\` in any text chat (Example: \`${prefix}fix @daym bro\`). This will give them back their microphone.`)
                .addField("**GitHub**", "This bot was written by hand using Node.js and discord.js! Want to see how it works? Checkout my github repo [here](https://github.com/da-the-dev/Among-Us-Muter)")
                .addField('**Patreon**', "Love this bot? Consider [donating a few dollans](https://www.patreon.com/da_dev) to help this project grow!")
                .setColor('#b50005')
                .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
            msg.channel.send(help)
        }
    }
