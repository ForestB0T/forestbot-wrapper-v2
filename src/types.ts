interface ForestBotAPIOptions {
    apiUrl: string
    websocket_url: string
    isBotClient: boolean
    apiKey: string
    logerrors?: boolean
    use_websocket?: boolean
    mc_server?: string
}

interface ForestBotWebsocketClientOptions {
    mc_server: string
    websocket_url: string
    apiKey: string
    isBotClient: boolean
}


interface ClientIdExchange {
    client_id: string

}
interface MinecraftChatMessage {
    name: string
    message: string
    date: string
    mc_server: string
    uuid: string
}

interface DiscordChatMessage {
    message: string
    username: string
    timestamp: string
    mc_server: string
    channel_id: string
    guild_id: string
    guild_name: string
}

interface MinecraftAdvancementMessage {
    username: string
    advancement: string
    time: number,
    mc_server: string,
    id?: number | null
    uuid: string
}

interface MinecraftPlayerJoinMessage {
    username: string
    uuid: string
    timestamp: string
    server: string
}

interface MinecraftPlayerLeaveMessage {
    username: string
    uuid: string
    timestamp: string
    server: string
}

interface MinecraftPlayerKillMessage {
    username: string
    uuid: string
    timestamp: string
    server: string
}

interface MinecraftPlayerDeathMessage {
    victim: string
    death_message: string

    //the object will be present only on pvp deaths and when recieving from websocket.
    //we do not use the object when sending a death to the api.
    //we send the murderer as a string, (username)
    murderer?: string
    time: number,
    type: "pve" | "pvp",
    mc_server: string,
    id?: number | null | undefined
    victimUUID: string,
    murdererUUID?: string
}

interface PlayerListUpdate { players: Player[] };

type messageActionTypes = "error" | "new_user" | "key-accepted" | "new_name" | "id" | "minecraft_chat" | "discord_chat"
    | "inbound_minecraft_chat" | "inbound_discord_chat" | "send_update_player_list" | "minecraft_advancement"
    | "minecraft_player_join" | "minecraft_player_leave" | "minecraft_player_kill" | "minecraft_player_death";
type inboundmessageDataTypes = DiscordChatMessage | MinecraftAdvancementMessage | MinecraftChatMessage
    | MinecraftPlayerDeathMessage | MinecraftPlayerKillMessage | MinecraftPlayerJoinMessage | MinecraftPlayerLeaveMessage | NewUserNameData | NewUserData | PlayerListUpdate;

// type outboundMessageActionTypes = 
// type outboundMessageDataTypes = any;

interface InBoundWebsocketMessage {
    // client_id: string,
    action: messageActionTypes
    data: inboundmessageDataTypes
}

interface OutboundWebsocketMessage {
    action: messageActionTypes,
    data: inboundmessageDataTypes
}

interface NewUserData { 
    user: string, 
    server: string 
}

interface NewUserNameData {
    old_name: string,
    new_name: string
    server: string
}

interface Playtime {
    playtime: number
}

interface Joindate {
    joindate: number | string
}

interface JoinCount {
    joincount: number
}

interface Kd {
    kills: number,
    deaths: number
}

interface Death {
    death_message: string,
    timestamp: number
}

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
    lastseen: number | string
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
    usernames: string[]
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
    username: string | null,
    kills: number,
    deaths: number,
    joindate: string,
    lastseen: string | null,
    UUID: string,
    playtime: number,
    joins: number,
    leaves: number,
    lastdeathTime: number,
    lastdeathString: string | null,
    mc_server: string
}

interface OnlineCheck {
    online: boolean,
    server: string | undefined | null
}

interface WhoIsData {
    description: string[]
}

interface ConvertToUUID {
    uuid: string
}

interface Quote {
    name: string,
    message: string,
    date: string,
    mc_server: string,
    uuid: string
}

interface hourlyActivity {
    hour: number,
    logins: number
}

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

interface FaqData {
    username: string,
    uuid: string,
    server: string,
    id: number,
    faq: string,
    timestamp: string,
    total: number,
}

export {
    FaqData,
    Advancement,
    AllPlayerStats,
    ClientIdExchange,
    ConvertToUUID,
    Death,
    DiscordChatMessage,
    ForestBotAPIOptions,
    ForestBotWebsocketClientOptions,
    InBoundWebsocketMessage,
    JoinCount,
    Joindate,
    Kd,
    Kill,
    LastSeen,
    Message,
    MessageCount,
    MinecraftAdvancementMessage,
    MinecraftChatMessage,
    MinecraftPlayerDeathMessage,
    MinecraftPlayerJoinMessage,
    MinecraftPlayerKillMessage,
    MinecraftPlayerLeaveMessage,
    NameFind,
    OnlineCheck,
    OutboundWebsocketMessage,
    Player,
    PlayerActivityByHourResponse,
    PlayerActivityByWeekDay,
    PlayerActivityByWeekDayResponse,
    PlayerActivityHourlyResults,
    Playtime,
    Quote,
    WhoIsData,
    WordOccurence,
    hourlyActivity,
    inboundmessageDataTypes,
    messageActionTypes,
    NewUserData,
    NewUserNameData
}