interface ForestBotAPIOptions { 
    apiUrl: string
    apiKey: string
    mc_server: string
    websocket_options?: {
        identifier: string
        websocket_url: string
    }
}

interface ForestBotWebsocketClientOptions {
    identifier: string
    websocket_url: string
    apiKey: string
}

interface MinecraftChatMessage {
    message: string
    username: string
    uuid: string
    timestamp: string
    server: string
};

interface DiscordChatMessage {
    message: string
    username: string
    timestamp: string
    server: string
    channel_id: string
    guild_id: string
    guild_name: string
}

interface MinecraftAdvancementMessage { 
    advancement: string
    username: string
    uuid: string
    timestamp: string
    server: string
};

interface MinecraftPlayerJoinMessage {
    username: string
    uuid: string
    timestamp: string
    server: string
};

interface MinecraftPlayerLeaveMessage {
    username: string
    uuid: string
    timestamp: string
    server: string
};

interface MinecraftPlayerKillMessage {
    username: string
    uuid: string
    timestamp: string
    server: string
};

interface MinecraftPlayerDeathMessage {
    timestamp: string
    server: string

    victim: string
    death_message: string
    murderer?: string
    type: "pve" | "pvp"
    victimUUID: string
    murdererUUID?: string
};

type messageActionTypes = "inbound_minecraft_chat" | "inbound_discord_chat" |"send_update_player_list" | "outbound_minecraft_chat" | "outbound_discord_chat" | "minecraft_advancement" | "minecraft_player_join" | "minecraft_player_leave" | "minecraft_player_kill" | "minecraft_player_death";
type inboundmessageDataTypes = DiscordChatMessage | MinecraftAdvancementMessage | MinecraftChatMessage | MinecraftPlayerDeathMessage | MinecraftPlayerKillMessage | MinecraftPlayerJoinMessage | MinecraftPlayerLeaveMessage;

// type outboundMessageActionTypes = 
// type outboundMessageDataTypes = any;

interface InBoundWebsocketMessage { 
    action: messageActionTypes
    data: inboundmessageDataTypes
};

interface OutboundWebsocketMessage {
    action: MessageActionTypes,
    data: outboundMessageDataTypes
}

interface Playtime {
    playtime: number
}

interface Joindate {
    joindate: number
}

interface JoinCount {
    joincount: number
}

interface Kd {
    kills: number,
    deaths: number
};

interface Death {
    death_message: string,
    timestamp: number
};

interface Kill {
    kill_message: string,
    timestamp: number
}

interface Message {
    username: string,
    message: string,
    timestamp: string
}

interface LastSeen {
    lastseen: number
}

interface MessageCount {
    messagecount: number
}

interface WordOccurence {
    word: string,
    count: number
}

interface NameFind {
    uuid: string,
    username: string
}

interface Advancement {
    advancement: string,
    timestamp: number
}

interface Player {
    username: string,
    uuid: string,
    latency: number,
    server: string
}
