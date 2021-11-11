import { VoiceState } from 'discord.js'
import { amCategory, amGenerator } from './find'
import sendMessage from './sendMessage'

const error = 'An error happened! Looks like Among Us Muter is missing some permissons! Please, make sure that "Among Us Muter" role has "Manage Channels" permisson enabled. If the original caterogy or lobby generator channel were compromised, please, re-add the bot *(`/info` to get the link to a GitHub page)*'
const error2 = 'An error happened! Looks like Among Us Muter is missing some permissons! Please, make sure that "Among Us Muter" role has "Move Members" permisson enabled. If the original caterogy or lobby generator channel were compromised, please, re-add the bot *(`/info` to get the link to a GitHub page)*'

export default async (oldState: VoiceState, newState: VoiceState) => {
    const { guild, member } = oldState
    await guild.channels.fetch()

    const category = amCategory(guild)
    const generator = amGenerator(guild)

    if (!category || !generator) return
    // Voice state update (mute, unmute, etc)
    if (oldState.channelId === newState.channelId) { return }
    // New lobby request
    if (newState.channel?.parentId === category?.id && newState.channel?.id === generator?.id) {
        guild.channels.create(member?.displayName || 'Unknown room', {
            parent: category,
            type: 'GUILD_VOICE',
            position: 100,
            userLimit: 10,
            permissionOverwrites: [
                { id: member!.id, allow: 'CREATE_INSTANT_INVITE' },
                { id: guild!.id, deny: 'CREATE_INSTANT_INVITE' }
                // { id: muteRoleId(guild), deny: 'SPEAK' }
            ]
        }).then(vc => {
            member?.voice.setChannel(vc).catch(async err => {
                console.log('An error in voiceStateUpdate. New lobby request (user joins). Can\'t move a member.')
                await sendMessage(guild, error)
            })
        }).catch(async err => {
            console.log('An error in voiceStateUpdate. New lobby request (user joins). Can\'t create a lobby.')
            await sendMessage(guild, error2)
        })
    }
    // Lobby is empty
    if (oldState.channel?.parentId === category?.id &&
        (!newState.channel || newState.channel?.parentId !== category?.id) &&
        oldState.channel?.members.size <= 0
    ) {
        oldState.channel?.delete().catch(async err => {
            console.log('An error in voiceState update. Lobby empty and missing permissons.')
            await sendMessage(guild, error)
        })
    }
    // Reassign lobby master if they leave
    if (oldState.channel?.parentId === category?.id &&
        (!newState.channel || newState.channel?.parentId !== category?.id) &&
        oldState.channel?.permissionsFor(oldState.member!, true).has('CREATE_INSTANT_INVITE') &&
        oldState.channel?.members.size > 0
    ) {
        const vc = oldState.channel
        const newMaster = vc?.members.random()
        const oldMaster = oldState.member
        await vc?.permissionOverwrites.delete(oldMaster!).catch(async err => {
            console.log('An error in voiceState update. Lobby master left and missing permissons.')
            await sendMessage(guild, error)
        })
        await vc?.permissionOverwrites.create(newMaster!, { CREATE_INSTANT_INVITE: true }).catch(err => console.log(err))
    }
    // If user left lobby
    if (oldState.channel?.parentId === category?.id &&
        oldState.channel?.members.find(m => m.permissionsIn(oldState.channel!).has('CREATE_INSTANT_INVITE'))?.voice.serverMute) {
        member?.voice.setMute(false)
            .catch(async err => {
                console.log('An error in voiceStateUpdate. User server unmute error\n', err)
                await sendMessage(guild, `${member}! You've left the lobby and now you are server muted! Please, join back and connect to a different voicechannel *before* disconnecting!`)
            })
    }
    if (newState.channel?.parentId === category?.id &&
        newState.channel?.members.find(m => m.permissionsIn(newState.channel!).has('CREATE_INSTANT_INVITE'))?.voice.serverMute) {
        member?.voice.setMute(true)
            .catch(err => console.log('An error in voiceStateUpdate. User server mute error.'))
    }
}
