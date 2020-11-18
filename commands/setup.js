const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    (args, msg, client) => {
        const guide = new Discord.MessageEmbed()
            .setTitle(`Here's a step-by-step guide "How to set up Among Us Muter On Your Server"`)
            .addField(`**Step 1: \`${prefix}addMuteRole\`**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`${prefix}addMuteRole @roleName\` in any text chat (Example: \`${prefix}addMuteRole @Among Us\`). Now you can give this role to users you trust to let mute people so that they can use \`$amg\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**Step 2: \`${prefix}addAmongUsChannel\`**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`${prefix}addAmoungUsChannel <channelid>\` in any textchat (Example: \`${prefix}addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**Step 3: \`${prefix}amg\`**`, `Once you have executed all previous commands, you can use \`${prefix}amg\`. To mute previously specified voicechannel, type \`${prefix}amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`${prefix}amg\` again. Channel will be un-muted shortly.`)
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
        msg.channel.send(guide)
    }
