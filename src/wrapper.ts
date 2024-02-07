import axios from "axios";
import ForestBotWebsocketClient from "./websocket.js";
import EventEmitter from "events";

declare interface ForestBotAPI {
    on(event: "websocket_error", listener: (error: Error) => void): this
    on(event: "minecraft_player_death", listener: (data: MinecraftPlayerDeathMessage) => void): this
    on(event: "minecraft_player_kill", listener: (data: MinecraftPlayerKillMessage) => void): this
    on(event: "minecraft_player_leave", listener: (data: MinecraftPlayerLeaveMessage) => void): this
    on(event: "minecraft_player_join", listener: (data: MinecraftPlayerJoinMessage) => void): this
    on(event: "minecraft_advancement", listener: (data: MinecraftAdvancementMessage) => void): this
    on(event: "discord_chat", listener: (data: DiscordChatMessage) => void): this
    on(event: "minecraft_chat", listener: (data: MinecraftChatMessage) => void): this
    on(event: "websocket_close", listener: (data: any) => void): this;
    on(event: "websocket_open", listener: () => void): this;
    
}



/**
 * @class ForestBotAPI 
 * series of helper functions that wrap around the main ForestBot API
 * https://github.com/forestB0t/hub
 * We also initialize the websocket here.
 */
class ForestBotAPI extends EventEmitter {
    private apiKey: string;

    public apiurl: string;
    public websocket: ForestBotWebsocketClient | undefined;
    public logErrors: boolean = false;

    constructor(options: ForestBotAPIOptions) {
        super()
        let { apiKey, apiUrl, logerrors, websocket_options } = options;

        this.apiurl = apiUrl;
        this.apiKey = apiKey;

        if (logerrors) {
            this.logErrors = true
        }

        /**
         * We are only initializing the websocket
         * IF websocket_options is present in the APIOptions
         */
        if (websocket_options) {

            const ws_options = {
                mc_server: websocket_options?.mc_server,
                websocket_url: websocket_options?.websocket_url,
                apiKey: this.apiKey
            }

            this.websocket = new ForestBotWebsocketClient(ws_options, this)
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
     * Get the stats for a user on a specific server
     * @param uuid The uuid for the user you want to get the stats for
     * @param server The minecraft server you want to get the stats for
     * @returns {AllPlayerStats} The stats for the user on the specified server
     * 
     */
    public async getStatsByUuid(uuid: string, server: string): Promise<AllPlayerStats|null> {
        try {
            const response = await axios.get(`${this.apiurl}/playeruuid?uuid=${uuid}&server=${server}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null
        }
    }

    /**
     * Gets the stats for a user on a specific server by username
     * @param username 
     * @param server 
     * @returns 
     */
    public async getStatsByUsername(username: string, server: string): Promise<AllPlayerStats|null> {
        try {
            const response = await axios.get(`${this.apiurl}/playername?name=${username}&server=${server}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null
        }
    }

    public async convertUsernameToUuid(username: string): Promise<string|null> {
        try {
            const response = await axios.get(`${this.apiurl}/convert-username-to-uuid?username=${username}`);
            if (!response || !response.data.uuid.String) return null;
            return response.data.uuid.String;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get the playtime for a user on a specific server
     * @param uuid The uuid for the user you want to get the playtime for
     * @param server The minecraft server you want to get the playtime for
     * @returns {Playtime} The playtime for the user on the specified server
     */
    public async getPlaytime(uuid: string, server: string): Promise<Playtime|null> {
        try {
            const user = await this.getStatsByUuid(uuid, server);
            if (user?.Playtime) {
                return { playtime: user.Playtime };
            } else return null
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
        
    }

    /**
     * Get the joindate for a user on a specific server
     * @param uuid The uuid for the user you want to get the joindate for
     * @param server The minecraft server you want to get the joindate for
     * @returns {Joindate} The joindate for the user on the specified server
     */
    public async getJoindate(uuid: string, server: string): Promise<Joindate|null> {
        try {
            const response = await this.getStatsByUuid(uuid, server);
            if (response?.Joindate) {
                return { joindate: response.Joindate };
            } else return null;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null
        }
    }

    /**
     * Get the joincount for a user on a specific server
     * @param uuid the uuid for the user you want to get the joincount for
     * @param server the minecraft server you want to get the joincount for
     * @returns {JoinCount} The joincount for the user on the specified server
     */
    public async getJoinCount(uuid: string, server: string): Promise<JoinCount|null> {
        try  {
            const response = await this.getStatsByUuid(uuid, server);
            if (response?.Joins) {
                return { joincount: response.Joins };
            } else return null;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get the lastseen for a user on a specific server
     * @param uuid the uuid for the user you want to get the lastseen for
     * @param server the minecraft server you want to get the lastseen for
     * @returns {LastSeen} The lastseen for the user on the specified server
     */
    public async getLastSeen(uuid: string, server: string): Promise<LastSeen|null> {
        // const response = await axios.get(`${this.apiurl}/lastseen/${uuid}/${server}`);
        // return { lastseen: response.data.lastseen };
        try { 
            const user = await this.getStatsByUuid(uuid, server);
            if (user?.LastSeen) {
                if (typeof user.LastSeen !== "string") {
                    return { lastseen: user.LastSeen.String };
                } else if (typeof user.LastSeen === "string") {
                    return { lastseen: user.LastSeen };
                } else return null;
            } else return null;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }



    /**
     * Get the kills / deaths count for a user on a specific server
     * @param uuid the uuid for the user you want to get kills / deaths count for
     * @param server the minecraft server you want to get the kills / deaths count for
     * @returns {Kd} The kills / deaths count for the user on the specified server
     */
    public async getKd(uuid: string, server: string): Promise<Kd|null> {
        // const response = await axios.get(`${this.apiurl}/kd/${uuid}/${server}`);
        // return { kills: response.data.kills, deaths: response.data.deaths };
        try {
            const user = await this.getStatsByUuid(uuid, server);
            if (user?.Kills && user?.Deaths) {
                return { kills: user.Kills, deaths: user.Deaths };
            } else return null; 

        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get a list of deaths for a user on a specific server with a limit
     * @param uuid the uuid for the user you want to get deaths for
     * @param server the minecraft server you want to get deaths for
     * @param limit the limit of deaths you want to get
     */
    public async getDeaths(uuid: string, server: string, limit: number, order: "DESC" | "ASC", type: "pvp"|"all"|"pve"): Promise<MinecraftPlayerDeathMessage[]|null> {
        try {
            const response = await axios.get(`${this.apiurl}/deaths?uuid=${uuid}&server=${server}&limit=${limit}&order=${order}&type=${type}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    };

    /**
     * Get a list of kills for a user on a specific server with a limit
     * @param uuid the uuid for the user you want to get kills for
     * @param server the minecraft server you want to get kills for
     * @param limit the limit of kills you want to get
     */
    public async getKills(uuid: string, server: string, limit: number, order: "DESC" | "ASC"): Promise<MinecraftPlayerDeathMessage[]|null> {
        try {
            const response = await axios.get(`${this.apiurl}/kills?uuid=${uuid}&server=${server}&limit=${limit}&order=${order}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    };

    /**
     * Get a list of messages for a user on a specific server with a limit
     * @param username the username for the user you want to get messages for
     * @param server the minecraft server you want to get messages for
     * @param limit the limit of messages you want to get
     */
    public async getMessages(username: string, server: string, limit: number, order: "DESC" | "ASC"): Promise<MinecraftChatMessage[]|null> {
        try {
            const response = await axios.get(`${this.apiurl}/messages?name=${username}&server=${server}&limit=${limit}&order=${order}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Getting a list of advancements for a user on a specific server with a limit and order.
     * @param uuid 
     * @param server 
     * @param limit 
     * @param order 
     * @returns 
     */
    public async getAdvancements(uuid: string, server: string, limit: number, order: "DESC" | "ASC"): Promise<MinecraftAdvancementMessage[]|null> {
        try {
            const response = await axios.get(`${this.apiurl}/advancements?uuid=${uuid}&server=${server}&limit=${limit}&order=${order}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get the message count for a user on a specific server
     * @param username the username for the user you want to get the message count for
     * @param server the minecraft server you want to get the message count for
     * @returns {MessageCount} The message count for the user on the specified server
     */
    public async getMessageCount(username: string, server: string): Promise<MessageCount|null> {
        try {
            const response = await axios.get(`${this.apiurl}/messagecount?username=${username}&server=${server}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get the word occurence for a user on a specific server
     * @param username the username for the user you want to get the word occurence for
     * @param server the minecraft server you want to get the word occurence for
     * @param word the word you want to get the occurence for
     * @returns {WordOccurence} The word occurence for the user on the specified server
     */
    public async getWordOccurence(username: string, server: string, word: string): Promise<WordOccurence|null> {
        try {
            const response = await axios.get(`${this.apiurl}/wordcount?username=${username}&server=${server}&word=${word}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get the uuid for a username
     * @param username the username you want to get the uuid for
     * @param server the minecraft server you want to get the uuid for
     * @returns {NameFind} The uuid for the username
     */
    public async getNameFinder(username: string, server: string): Promise<NameFind|null> {
        try {
            const response = await axios.get(`${this.apiurl}/namesearch?username=${username}&server=${server}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Check if the specified username is online or not.
     * will return the server the user is on if they are online.
     * @param username the user we want to check is online or not.
     * @returns {OnlineCheck}
     */
    public async getOnlineCheck(username: string): Promise<OnlineCheck|null> {
        try {
            const response = await axios.get(`${this.apiurl}/online?username=${username}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Getting the self submitted whois data for a user.
     * @param username 
     * @returns 
     */
    public async getWhoIs(username: string): Promise<WhoIsData|null> {
        try {
            const response = await axios.get(`${this.apiurl}/whois?username=${username}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }


    /**
     * Get a random quote for a user on a specific server
     * @param username 
     * @param server 
     * @returns 
     */
    public async getQuote(username: string, server: string): Promise<Quote|null> {
        try {  
            const response = await axios.get(`${this.apiurl}/quote?name=${username}&server=${server}`);
            return response.data
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            } 
            return null;
        }
    }

    /**
     * Get the top statistic for a server with a limit
     * @param stat 
     * @param server 
     * @param limit 
     * @returns 
     */
    public async getTopStatistic(stat: string, server: string, limit: number): Promise<any|null> {
        try {
            const response = await axios.get(`${this.apiurl}/top-statistic?statistic=${stat}&server=${server}&limit=${limit}`);
            return response.data
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get the hourly player activity for a server, this will return the amount of unique logins for each hour of the day for each day.
     * @param server
     */
    public async getHourlyPlayerActivity(server: string): Promise<PlayerActivityByHourResponse|null> { 
        try {   
            const response = await axios.get(`${this.apiurl}/player-activity-by-hour?server=${server}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

    /**
     * Get the daily player activity for a server, this will return the amount of logins for each day of the week.
     * @param server
     */
    public async getTotalDailyLogins(server: string): Promise<PlayerActivityByWeekDayResponse|null> { 
        try {   
            const response = await axios.get(`${this.apiurl}/player-activity-by-week-day?server=${server}`);
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }


    /**
     * 
     * 
     * POST REQUESTS
     * 
     */

    public async postWhoIsDescription(username: string, description: string) {
        try {
            const response = await axios.post(`${this.apiurl}/whois-description`, {
                username: username,
                description: description
            });
            return response.data;
        } catch (err) {
            if (this.logErrors) {
                console.error(err);
            }
            return null;
        }
    }

}


export default ForestBotAPI;