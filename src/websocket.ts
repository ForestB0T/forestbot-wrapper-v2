import WebSocket from "ws";
import { ForestBotAPI } from "./wrapper.js";
import { ForestBotWebsocketClientOptions, OutboundWebsocketMessage, InBoundWebsocketMessage, MinecraftChatMessage, DiscordChatMessage, MinecraftPlayerDeathMessage, MinecraftPlayerKillMessage, MinecraftPlayerJoinMessage, MinecraftPlayerLeaveMessage, MinecraftAdvancementMessage, Player, inboundmessageDataTypes, messageActionTypes, NewUserNameData, NewUserData } from "./types.js";

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
    //The api key, can be a read write key or a read only key.
    private apiKey: string

    //We get this from the websocket server when we connect then store it here.
    //private givenClientId: string | undefined;

    //This is the interval that will be used to ping the websocket server every 5 seconds.
    private PingInterval: NodeJS.Timeout | undefined;

    //The minecraft server we want data for.
    private mc_server: string

    private isBotClient: boolean = false;

    //Our main API instance
    private ForestBotApi: ForestBotAPI;

    //The websocket base url
    public websocket_url: string;

    //Is the client connected to the websocket server?
    public isClientConnected: boolean = false;

    //The websocket instance
    public Socket: WebSocket | undefined;

    constructor(options: ForestBotWebsocketClientOptions, ForestBotApi: ForestBotAPI) {
        this.ForestBotApi = ForestBotApi;
        const { mc_server, websocket_url, apiKey, isBotClient } = options;

        this.websocket_url = websocket_url;
        this.isBotClient = isBotClient;

        this.apiKey = apiKey;
        this.mc_server = mc_server;

        this.Socket = undefined
        this.authenticate();
    };

    //our websocket url will look something like:
    //api-key - this being the api key
    private async authenticate() {


        /**
         * Client types can be
         * "minecraft" | "discord" | "other"
         */
        const client_type: string = this.isBotClient === true ? "minecraft" : "discord";

        const url = `${this.websocket_url}/websocket/connect`
        const headers = { 'x-api-key': this.apiKey, 'client-type': client_type, 'mc_server': this.mc_server};
        this.Socket = new WebSocket(url, { headers });
        this.handleEvents();
    }

    /**
     * Helper function to send messages to the websocket. Takes in dynamic interface.
     * @param {object} data - The data you want to send to the websocket.
     */
    public async sendMessage(data: { data: inboundmessageDataTypes, action: messageActionTypes }) {

        // if (this.givenClientId == undefined) {
        //     return this.ForestBotApi.emit("websocket_error", new Error("Client ID is not defined yet"))
        // }

        const outBoundWebSocketMessage: OutboundWebsocketMessage = {
            action: data.action as any,
            data: data.data,

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
        this.PingInterval = setInterval(() => {
            this.Socket?.ping("pingdata");
        }, 5000)
    };

    /**
     * 
     * Messages that are sent from the websocket server to the client.
     * API (HUB) -> BOT
     * 
     */
    private handleInBoundMessage(message: WebSocket.Data) {
        const data: InBoundWebsocketMessage = JSON.parse(message.toString());

        switch (data.action) {
            case "inbound_minecraft_chat":
                this.ForestBotApi.emit("inbound_minecraft_chat", data.data as MinecraftChatMessage)
                break;

            case "inbound_discord_chat":
                this.ForestBotApi.emit("inbound_discord_chat", data.data as DiscordChatMessage)
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

            case "new_name":
                this.ForestBotApi.emit("new_name", data.data as NewUserNameData)
                break;

            case "new_user":
                this.ForestBotApi.emit("new_user", data.data as NewUserData)
                break;

            case "error":
                this.ForestBotApi.emit("websocket_error", data.data as any);
                break;

            case "key-accepted":
                this.ForestBotApi.emit("key-accepted", data.data as any)
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
        return await this.sendMessage({ action: "inbound_minecraft_chat", data: msgData })
    };

    /**
     * Sending discord chat messages to the websocket
     * @param msgData {DiscordChatMessage}
     * @returns void
     */
    public async sendDiscordChatMessage(msgData: DiscordChatMessage) {
        return await this.sendMessage({ action: "inbound_discord_chat", data: msgData })
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
        return await this.sendMessage({ action: "send_update_player_list", data: { players: msgData } })
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
     * Sending player death messages to the websocket
     * @param msgData {MinecraftPlayerDeathMessage}
     * @returns void
     */
    public async sendPlayerDeath(msgData: MinecraftPlayerDeathMessage) {
        return await this.sendMessage({ action: "minecraft_player_death", data: msgData })
    }

}
