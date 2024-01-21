import axios from "axios";
import ForestBotWebsocketClient from "./websocket.js";

/**
 * @class ForestBotAPI 
 * series of helper functions that wrap around the main ForestBot API
 * https://github.com/forestB0t/hub
 * We also initialize the websocket here.
 */
export default class ForestBotAPI {

    public apiurl: string;
    private apiKey: string;

    constructor(options: ForestBotAPIOptions) {
        let { apiKey, apiUrl, mc_server, websocket_options } = options;

        this.apiurl = apiUrl;
        this.apiKey = apiKey;


        /**
         * We are only initializing the websocket
         * IF websocket_options is present in the APIOptions
         */
        if (websocket_options) {

            const ws_options = {
                identifier: mc_server,
                websocket_url: websocket_options?.websocket_url,
                apiKey: this.apiKey
            }
            
            new ForestBotWebsocketClient(ws_options)
        }

    }

    /**
     * 
     * 
     * HELPER FUNCTIONS FOR API REQUESTS
     * 
     * 
     */
    /**
     * Get the playtime for a user on a specific server
     * @param uuid The uuid for the user you want to get the playtime for
     * @param server The minecraft server you want to get the playtime for
     * @returns {Playtime} The playtime for the user on the specified server
     */
    public async getPlaytime(uuid: string, server:string): Promise<Playtime> {
        const response = await axios.get(`${this.apiurl}/playtime/${uuid}/${server}`);
        return { playtime: response.data.playtime };
    }

    /**
     * Get the joindate for a user on a specific server
     * @param uuid The uuid for the user you want to get the joindate for
     * @param server The minecraft server you want to get the joindate for
     * @returns {Joindate} The joindate for the user on the specified server
     */
    public async getJoindate(uuid: string, server: string): Promise<Joindate> {
        const response = await axios.get(`${this.apiurl}/joindate/${uuid}/${server}`);
        return { joindate: response.data.joindate };
    }

    /**
     * Get the joincount for a user on a specific server
     * @param uuid the uuid for the user you want to get the joincount for
     * @param server the minecraft server you want to get the joincount for
     * @returns {JoinCount} The joincount for the user on the specified server
     */
    public async getJoinCount(uuid: string, server: string): Promise<JoinCount> {
        const response = await axios.get(`${this.apiurl}/joincount/${uuid}/${server}`);
        return { joincount: response.data.joincount };
    }

    /**
     * Get the lastseen for a user on a specific server
     * @param uuid the uuid for the user you want to get the lastseen for
     * @param server the minecraft server you want to get the lastseen for
     * @returns {LastSeen} The lastseen for the user on the specified server
     */
    public async getLastSeen(uuid: string, server: string): Promise<LastSeen> { 
        const response = await axios.get(`${this.apiurl}/lastseen/${uuid}/${server}`);
        return { lastseen: response.data.lastseen };
    }


    /**
     * Get the kills / deaths count for a user on a specific server
     * @param uuid the uuid for the user you want to get kills / deaths count for
     * @param server the minecraft server you want to get the kills / deaths count for
     * @returns {Kd} The kills / deaths count for the user on the specified server
     */
    public async getKd(uuid: string, server: string): Promise<Kd> {
        const response = await axios.get(`${this.apiurl}/kd/${uuid}/${server}`);
        return { kills: response.data.kills, deaths: response.data.deaths };
    }

    /**
     * Get a list of deaths for a user on a specific server with a limit
     * @param uuid the uuid for the user you want to get deaths for
     * @param server the minecraft server you want to get deaths for
     * @param limit the limit of deaths you want to get
     */
    public async getDeaths(uuid: string, server: string, limit: number, order: "DESC"|"ASC"): Promise<Death[]> {
        const response = await axios.get(`${this.apiurl}/deaths/${uuid}/${server}/${limit}/${order}`);
        return response.data.deaths;
    };

    /**
     * Get a list of kills for a user on a specific server with a limit
     * @param uuid the uuid for the user you want to get kills for
     * @param server the minecraft server you want to get kills for
     * @param limit the limit of kills you want to get
     */
    public async getKills(uuid: string, server: string, limit: number, order: "DESC"|"ASC"): Promise<Kill[]> {
        const response = await axios.get(`${this.apiurl}/kills/${uuid}/${server}/${limit}/${order}`);
        return response.data.kills;
    };

    /**
     * Get a list of messages for a user on a specific server with a limit
     * @param username the username for the user you want to get messages for
     * @param server the minecraft server you want to get messages for
     * @param limit the limit of messages you want to get
     */
    public async getMessages(username: string, server: string, limit: number, order: "DESC"|"ASC"): Promise<Message[]> {
        const response = await axios.get(`${this.apiurl}/messages/${username}/${server}/${limit}/${order}`);
        return response.data.messages;
    }

    public async getAdvancements(uuid: string, server: string, limit: number, order: "DESC"|"ASC"): Promise<Advancement[]> {
        const response = await axios.get(`${this.apiurl}/advancements/${uuid}/${server}/${limit}/${order}`);
        return response.data.advancements;
    }

    /**
     * Get the message count for a user on a specific server
     * @param username the username for the user you want to get the message count for
     * @param server the minecraft server you want to get the message count for
     * @returns {MessageCount} The message count for the user on the specified server
     */
    public async getMessageCount(username: string, server: string): Promise<MessageCount> { 
        const response = await axios.get(`${this.apiurl}/messagecount/${username}/${server}`);
        return { messagecount: response.data.messagecount };
    }

    /**
     * Get the word occurence for a user on a specific server
     * @param username the username for the user you want to get the word occurence for
     * @param server the minecraft server you want to get the word occurence for
     * @param word the word you want to get the occurence for
     * @returns {WordOccurence} The word occurence for the user on the specified server
     */
    public async getWordOccurence(username: string, server: string, word: string): Promise<WordOccurence> { 
        const response = await axios.get(`${this.apiurl}/wordoccurence/${username}/${server}/${word}`);
        return { word: response.data.word, count: response.data.count };
    }

    /**
     * Get the uuid for a username
     * @param username the username you want to get the uuid for
     * @returns {NameFind} The uuid for the username
     */
    public async getNameFinder(username: string): Promise<NameFind> {
        const response = await axios.get(`${this.apiurl}/namefinder/${username}`);
        return { uuid: response.data.uuid, username: response.data.username };
    }

}   