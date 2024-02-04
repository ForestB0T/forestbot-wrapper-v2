import WebSocket from "ws";
import ForestBotAPI from "./wrapper.js";










/**
 * @class ForestBotWebsocketClient
 * This class will completely handle our websocket instance
 * and have numerous helper functions and event emmiters to easily 
 * transmit and read data in real time from Minecraft Servers.
 * This is really good for live chat and accurate playtime readings.
 * basically everything else is able to go through regular http POST and GET requests.
 * I guess you could say "Important stuff" will be transmitted via websocket.
 */
export default class ForestBotWebsocketClient {

    //The websocket base url
    public websocket_url: string;

    //The api key, can be a read write key or a read only key.
    private apiKey: string

    //We get this from the websocket server when we connect then store it here.
    private givenClientId: string | undefined;

    //This is the interval that will be used to ping the websocket server every 5 seconds.
    private PingInterval: NodeJS.Timeout | undefined;

    //The minecraft server we want data for.
    private mc_server: string

    //Our main API instance
    private ForestBotApi: ForestBotAPI;

    //Is the client connected to the websocket server?
    public isClientConnected: boolean = false;

    //The websocket instance
    public Socket: WebSocket | undefined;

    constructor(options: ForestBotWebsocketClientOptions, ForestBotApi: ForestBotAPI) {
        this.ForestBotApi = ForestBotApi;
        const { mc_server, websocket_url, apiKey } = options;

        this.websocket_url = websocket_url;

        this.apiKey = apiKey;
        this.mc_server = mc_server;

        this.Socket = undefined
        this.authenticate();
    };

    //our websocket url will look something like:
    //ws://localhost:5000/authenticate?server=simplyvanilla&&x-api-key=123456789
    //client-id - this being the minecraft server name
    //api-key - this being the api key
    private async authenticate() {
        console.log("Connecting to ForestBot Websocket... at ", this.websocket_url, " for server ", this.mc_server, " with api key ", this.apiKey)
        const url = `${this.websocket_url}?server=${this.mc_server}&&x-api-key=${this.apiKey}`
        this.Socket = new WebSocket(url);
        this.handleEvents();
    }

    /**
     * Helper function to send messages to the websocket. Takes in dynamic interface.
     * @param {object} data - The data you want to send to the websocket.
     */
    public async sendMessage(data: { data: any, action: string }) {

        const outBoundWebSocketMessage: OutboundWebsocketMessage = {
            client_id: this.givenClientId || "",
            data: data.data,
            action: data.action
        }
        //After we create our data types we need to come back here and explicitly add types for our data. For now the data will be of type "any"
        const message = JSON.stringify(outBoundWebSocketMessage);
        return this.Socket?.send(message);
    }

    private handleEvents() {

        this.Socket?.on("open", this.handleOpen.bind(this))
        this.Socket?.on("error", this.handleError.bind(this))
        this.Socket?.on("close", this.handleClose.bind(this))
        this.Socket?.on("message", this.handleInBoundMessage.bind(this))
    }

    private handleError(error: Error) {
        this.ForestBotApi.emit("websocket_error", error)
    }

    private handleClose(reason: string) {
        this.ForestBotApi.emit("websocket_close", reason)
        this.isClientConnected = false;
        this.PingInterval && clearInterval(this.PingInterval);
    }

    private handleOpen() {
        this.isClientConnected = true;
        this.ForestBotApi.emit("websocket_open")
        console.log("opened")

        this.PingInterval = setInterval(() => {
            this.Socket?.ping("pingdata");
        }, 5000)

    };

    /**
     * 
     * Messages that are sent from the websocket server to the client.
     * 
     */

    // on(event: "minecraft_chat", listener: (data: MinecraftChatMessage) => void): this;
    // on(event: "discord_chat", listener: (data: DiscordChatMessage) => void): this;
    // on(event: "minecraft_player_death", listener: (data: MinecraftPlayerDeathMessage) => void): this;

    private handleInBoundMessage(message: WebSocket.Data) {
        const data: InBoundWebsocketMessage = JSON.parse(message.toString());

        switch (data.action) {
            case "minecraft_chat":
                this.ForestBotApi.emit("minecraft_chat", data.data as MinecraftChatMessage)
                break;

            case "discord_chat":
                this.ForestBotApi.emit("discord_chat", data.data as DiscordChatMessage)
                break;

            case "minecraft_player_death":
                this.ForestBotApi.emit("minecraft_player_death", data.data as MinecraftPlayerDeathMessage)
                break;

            case "minecraft_player_kill":
                this.ForestBotApi.emit("minecraft_player_kill", data.data as MinecraftPlayerKillMessage)
                break;

            case "minecraft_player_join":
                this.ForestBotApi.emit("minecraft_player_join", data.data as MinecraftPlayerJoinMessage)
                break;

            case "minecraft_player_leave":
                this.ForestBotApi.emit("minecraft_player_leave", data.data as MinecraftPlayerLeaveMessage)
                break;

            case "minecraft_advancement":
                this.ForestBotApi.emit("minecraft_advancement", data.data as MinecraftAdvancementMessage)
                break;

            case "id":
                this.givenClientId = data.client_id;                
                break;

            default:
                this.ForestBotApi.emit("unknown_message", data)
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
        return await this.sendMessage({ action: "minecraft_chat", data: msgData })
    };

    /**
     * Sending discord chat messages to the websocket
     * @param msgData {DiscordChatMessage}
     * @returns void
     */
    public async sendDiscordChatMessage(msgData: DiscordChatMessage) {
        return await this.sendMessage({ action: "discord_chat", data: msgData })
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
