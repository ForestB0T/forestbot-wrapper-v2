interface ForestBotAPIOptions {
    apiUrl: string
    apiKey: string
    mc_server: string
    logerrors?: boolean
    websocket_options?: {
        websocket_url: string
    }
}

interface ClientIdExchange {
    client_id: string

}

interface ForestBotWebsocketClientOptions {
    mc_server: string
    websocket_url: string
    apiKey: string
}

interface MinecraftChatMessage {
    name: string
    message: string
    date: string
    mc_server: string
    uuid: string
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
    username: string
    advancement: string
    time: number,
    mc_server: string,
    uuid: string
    id: number | null
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
    victim: string
    death_message: string

    //the object will be present only on pvp deaths and when recieving from websocket.
    //we do not use the object when sending a death to the api.
    //we send the murderer as a string, (username)
    murderer: { String: string, Valid: boolean } | string | undefined
    time: number,
    type: "pve"|"pvp",
    mc_server: string,
    id: number | null | undefined
    victimUUID: string,
    murdererUUID?: string
};

type messageActionTypes = "id" | "minecraft_chat" | "discord_chat" | "send_update_player_list" | "minecraft_advancement" | "minecraft_player_join" | "minecraft_player_leave" | "minecraft_player_kill" | "minecraft_player_death";
type inboundmessageDataTypes = DiscordChatMessage | MinecraftAdvancementMessage | MinecraftChatMessage | MinecraftPlayerDeathMessage | MinecraftPlayerKillMessage | MinecraftPlayerJoinMessage | MinecraftPlayerLeaveMessage;

// type outboundMessageActionTypes = 
// type outboundMessageDataTypes = any;

interface InBoundWebsocketMessage {
    client_id: string,
    action: messageActionTypes
    data: inboundmessageDataTypes
};

interface OutboundWebsocketMessage {
    client_id: string,
    action: MessageActionTypes,
    data: outboundMessageDataTypes
}

interface Playtime {
    playtime: number
}

interface Joindate {
    joindate: number|string
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
    lastseen: number|string
}

interface MessageCount {
    name: string,
    count: number
}

interface WordOccurence {
    name: string,
    count: number,
    word: string
}

interface NameFind {
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

interface AllPlayerStats {
    Username: string,
    Kills: number,
    Deaths: number,
    Joindate: string,
    LastSeen: string | null | { String: string, Valid: boolean },
    UUID: string,
    Playtime: number,
    Joins: number,
    Leaves: number,
    LastDeathTime: number,
    LastDeathString: string | null,
    MCServer: string
}

interface OnlineCheck {
    online: boolean,
    server: string | undefined | null
}

type WhoIsData = string[];

interface ConvertToUUID {
    uuid: string
}

interface Quote {
    name: string, 
    message: string,
    Date: { String: string, Valid: boolean },
    mc_server: string,
    uuid: string
}

interface hourlyActivity {
    hour: number,
    logins: number
};

interface PlayerActivityHourlyResults {
    weekday: number;
    activity: hourlyActivity[]
}

interface PlayerActivityByHourResponse {
    player_activity_by_hour: PlayerActivityHourlyResults[]
}

interface PlayerActivityByWeekDay {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
}

interface PlayerActivityByWeekDayResponse {
    player_activity_by_week_day: PlayerActivityByWeekDay;
  }