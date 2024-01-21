import WebSocket from "ws";
import EventEmitter from "events";


/**
 * @class ForestBotWebsocketClient
 * This class will completely handle our websocket instance
 * and have numerous helper functions and event emmiters to easily 
 * transmit and read data in real time from Minecraft Servers.
 * This is really good for live chat and accurate playtime readings.
 * basically everything else is able to go through regular http POST and GET requests.
 * I guess you could say "Important stuff" will be transmitted via websocket.
 */
export default class ForestBotWebsocketClient extends EventEmitter {

    public websocket_url: string;
    public identifier: string

    private apiKey: string
    
    private PingInterval: NodeJS.Timeout | undefined;
    

    /**
     * Boolean to check if our client is currently connected to the websocket server!
     */
    public isClientConnected: boolean = false;
    public Socket: WebSocket | undefined;

    constructor(options: ForestBotWebsocketClientOptions){
        super()
        const { identifier, websocket_url, apiKey  } = options;

        this.websocket_url = websocket_url;
        this.identifier = identifier;
        this.apiKey = apiKey;

        this.Socket = undefined
        this.authenticate();
    };

    //our websocket url will look something like:
    //ws://localhost:5000/authenticate?client-id=newtest&client-type=minecraft-bot&x-api-key=123456789
    //client-id - this being the minecraft server name
    //api-key - this being the api key
    private async authenticate() {
        //lets construct a url!
        const url = `${this.websocket_url}?client-id=${this.identifier}&x-api-key=${this.apiKey}`
        this.Socket = new WebSocket(url);
        this.handleEvents();
    }

    /**
     * Helper function to send messages to the websocket. Takes in dynamic interface.
     * @param {object} data - The data you want to send to the websocket.
     */
    public async sendMessage(data: OutboundWebsocketMessage) {
        //After we create our data types we need to come back here and explicitly add types for our data. For now the data will be of type "any"
        const message = JSON.stringify(data);
        return this.Socket?.send(message);
    }

    private handleEvents() {
        this.Socket?.on("open", this.handleOpen.bind(this))
        this.Socket?.on("error", this.handleError.bind(this))
        this.Socket?.on("close", this.handleClose.bind(this))
        this.Socket?.on("message", this.handleInBoundMessage.bind(this))
    }

    private handleError(error: Error) {
        this.emit("websocket_error", error)
    }

    private handleClose(reason: string) {
        this.emit("websocket_close", reason)
        this.isClientConnected = false;
        this.PingInterval && clearInterval(this.PingInterval);
    }

    private handleOpen() {
        this.isClientConnected = true;
        this.emit("websocket_open")

        this.PingInterval = setInterval(() => { 
            this.Socket?.ping("pingdata");
        }, 5000)

    };

    /**
     * 
     * Messages that are sent from the websocket server to the client.
     * 
     */
    private handleInBoundMessage(message: WebSocket.Data) {
        const data: InBoundWebsocketMessage= JSON.parse(message.toString());

        switch (data.action) {
            case "inbound_minecraft_chat":
                this.emit("minecraft_chat", data.data as MinecraftChatMessage)
                break;

            case "inbound_discord_chat":
                this.emit("discord_chat", data.data as DiscordChatMessage)
                break;

            case "minecraft_player_death":
                this.emit("minecraft_player_death", data.data as MinecraftPlayerDeathMessage)
                break;

            case "minecraft_player_kill":
                this.emit("minecraft_player_kill", data.data as MinecraftPlayerKillMessage)
                break;

            case "minecraft_player_join":
                this.emit("minecraft_player_join", data.data as MinecraftPlayerJoinMessage)
                break;

            case "minecraft_player_leave":
                this.emit("minecraft_player_leave", data.data as MinecraftPlayerLeaveMessage)
                break;

            case "minecraft_advancement":
                this.emit("minecraft_advancement", data.data as MinecraftAdvancementMessage)
                break;

            default:
                this.emit("unknown_message", data)
                break;
        }

    }

    /**
     * Here are some helper functions for sending messages to the websocket.
     * like sending minecraft chat messages, discord chat messages, and updating the player list, advancements, kills.
     */
     
    /**
     * Sending player chat messages to the websocket
     * @param msgData {MinecraftChatMessage}
     * @returns void
     */
    public async sendMinecraftChatMessage(msgData: MinecraftChatMessage) {
        return await this.sendMessage({ action: "outbound_minecraft_chat", data: msgData })
    };

    /**
     * Sending discord chat messages to the websocket
     * @param msgData {DiscordChatMessage}
     * @returns void
     */
    public async sendDiscordChatMessage(msgData: DiscordChatMessage) {
        return await this.sendMessage({ action: "outbound_discord_chat", data: msgData })
    };

    /**
     * Sending player list updates to the websocket
     * Sending an array of Player to the websocket.
     * 
     * You would want to run this every minute.
     * this also handles player playtime.
     * @param msgData {PlayerListUpdate}
     * @returns void
     */
    public async sendPlayerListUpdate(msgData: Player[]) {
        return await this.sendMessage({ action: "send_update_player_list", data: msgData })
    };

    /**
     * Sending player advancement updates to the websocket
     * @param msgData {MinecraftAdvancementMessage}
     * @returns void
     */
    public async sendPlayerAdvancement(msgData: MinecraftAdvancementMessage) {
        return await this.sendMessage({ action: "minecraft_advancement", data: msgData })
    }

    /**
     * Sending player join messages to the websocket
     * @param msgData {MinecraftPlayerJoinMessage}
     * @returns void
     */
    public async sendPlayerJoin(msgData: MinecraftPlayerJoinMessage) {
        return await this.sendMessage({ action: "minecraft_player_join", data: msgData })
    }

    /**
     * Sending player leave messages to the websocket
     * @param msgData {MinecraftPlayerLeaveMessage}
     * @returns void
     */
    public async sendPlayerLeave(msgData: MinecraftPlayerLeaveMessage) {
        return await this.sendMessage({ action: "minecraft_player_leave", data: msgData })
    }

    /**
     * Sending player kill messages to the websocket
     * @param msgData {MinecraftPlayerKillMessage}
     * @returns void
     */
    public async sendPlayerKill(msgData: MinecraftPlayerKillMessage) {
        return await this.sendMessage({ action: "minecraft_player_kill", data: msgData })
    }

    /**
     * Sending player death messages to the websocket
     * @param msgData {MinecraftPlayerDeathMessage}
     * @returns void
     */
    public async sendPlayerDeath(msgData: MinecraftPlayerDeathMessage) {
        return await this.sendMessage({ action: "minecraft_player_death", data: msgData })
    }

}
