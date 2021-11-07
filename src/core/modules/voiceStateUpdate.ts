import { VoiceState } from "discord.js"
import { amCategory, amGenerator } from "./find"

export default async (oldState: VoiceState, newState: VoiceState) => {
    const { guild, member } = oldState
    await guild.channels.fetch()

    const category = amCategory(guild)
    // try {
    //     console.log('vsu categoty', category.id)
    // } catch (e) {
    //     console.log(category)
    // }
    const generator = amGenerator(guild)

    // Voice state update (mute, unmute, etc)
    if (oldState.channelId === newState.channelId)
        return
    // New lobby request
    if (newState.channel?.parentId === category?.id && newState.channel?.id === generator?.id) {
        guild.channels.create(member?.displayName || 'Unknown room', {
            parent: category,
            type: 'GUILD_VOICE',
            position: 100,
            userLimit: 10,
            permissionOverwrites: [
                { id: member!.id, allow: 'CREATE_INSTANT_INVITE' },
                { id: guild!.id, deny: 'CREATE_INSTANT_INVITE' },
                // { id: muteRoleId(guild), deny: 'SPEAK' }
            ]
        }).then(vc => member?.voice.setChannel(vc))
    }
    // Lobby is empty
    if (oldState.channel?.parentId === category?.id &&
        (!newState.channel || newState.channel?.parentId != category?.id) &&
        oldState.channel?.members.size <= 0
    )
        oldState.channel?.delete()
    // Reassign lobby master if they leave
    if (oldState.channel?.parentId === category?.id &&
        (!newState.channel || newState.channel?.parentId != category?.id) &&
        oldState.channel?.permissionsFor(oldState.member!, true).has('CREATE_INSTANT_INVITE') &&
        oldState.channel?.members.size > 0
    ) {
        const vc = oldState.channel
        const newMaster = vc?.members.random()
        const oldMaster = oldState.member
        await vc?.permissionOverwrites.delete(oldMaster!)
        await vc?.permissionOverwrites.create(newMaster!, { CREATE_INSTANT_INVITE: true })
    }
    // If user left lobby
    if (oldState.channel?.parentId === category?.id &&
        oldState.channel?.members.find(m => m.permissionsIn(oldState.channel!).has('CREATE_INSTANT_INVITE'))?.voice.serverMute)
        member?.voice.setMute(false).catch(err => console.log('User server unmute error'))
    if (newState.channel?.parentId === category?.id &&
        newState.channel?.members.find(m => m.permissionsIn(newState.channel!).has('CREATE_INSTANT_INVITE'))?.voice.serverMute)
        member?.voice.setMute(true)
}