import ForestBotAPI from "./wrapper.js";
export default ForestBotAPI;



// (async () => {
//     const forestBotAPI = new ForestBotAPI({
//         apiKey: "this_is_the_read__write_key",
//         apiUrl: "http://127.0.0.1:5000/api/v1",
//         mc_server: "simplyvanilla",
//         logerrors: true,
//         // websocket_options: {
//         //     websocket_url: "ws://127.0.0.1:5000/api/v1/websocket/connect"
//         // }
//     });

//     // forestBotAPI.on("websocket_error", err => {
//     //     console.log(err, " keke poop kek")
//     // })
    
//     // const res = await forestBotAPI.getNameFinder("neofet", "simplyvanilla");
//     // console.log(res);

//     // const deaths = await forestBotAPI.getDeaths("5321b986-98f7-43d1-a215-c675a207cb4a", "simplyvanilla", 10, "DESC", "pve");
//     // console.log(deaths)
    
//     // for (const death of deaths) {
//     //     if (death.murderer && typeof death.murderer !== "string") {
//     //         const murdererObject = death.murderer as { String: string, Valid: boolean };
//     //         if (murdererObject && typeof murdererObject.String === "string") {
//     //             console.log("pvp kill", murdererObject.String)
//     //         }
//     //     }
//     // }

//     // const kills = await forestBotAPI.getKills("5321b986-98f7-43d1-a215-c675a207cb4a", "simplyvanilla", 10, "DESC");
//     // console.log(kills);

//     // const messages = await forestBotAPI.getMessages("neofetching", "simplyvanilla", 10, "DESC");
//     // console.log(messages);

//     // const advancement = await forestBotAPI.getAdvancements("5321b986-98f7-43d1-a215-c675a207cb4a", "simplyvanilla", 10, "DESC");
//     // console.log(advancement)

//     // const user = await forestBotAPI.getStatsByUsername("neofetching", "simplyvanilla");
//     // console.log(user);

//     // const msgCount = await forestBotAPI.getMessageCount("neofetching", "simplyvanilla");
//     // console.log(msgCount);

//     // const wordOccurcne = await forestBotAPI.getWordOccurence("neofetching", "simplyvanilla", "kek")
//     // console.log(wordOccurcne)

//     // const nameFinder = await forestBotAPI.getNameFinder("neofetching", "simplyvanilla");
//     // console.log(nameFinder);

//     //everything commented out has been tested and works.

//     // const onlineCheck = await forestBotAPI.getOnlineCheck("neofetching");
//     // console.log(onlineCheck);

//     // const whoisdata = await forestBotAPI.getWhoIs("neofetchingww");
//     // if (!whoisdata) {
//     //     console.log("No data for whois")
//     // }

//     // console.log(whoisdata)

//     // const uuid = await forestBotAPI.convertUsernameToUuid("neofetching");
//     // console.log(uuid);

//     // const uuid = await forestBotAPI.convertUsernameToUuid("6010electrode");
//     // if (!uuid) {
//     //     console.log("No uuid found from this username")
//     //     return;
//     // };
    
//     // const joindate = await forestBotAPI.getJoindate(uuid, "simplyvanilla");
//     // console.log(joindate)

//     // const playtime = await forestBotAPI.getPlaytime(uuid, "simplyvanilla");
//     // console.log(playtime);

//     // const joincount = await forestBotAPI.getJoinCount(uuid, "simplyvanilla");
//     // console.log(joincount);

//     // const lastseen = await forestBotAPI.getLastSeen(uuid, "simplyvanilla");
//     // console.log(lastseen);

//     // const kd = await forestBotAPI.getKd(uuid, "simplyvanilla");
//     // console.log(kd);

//     // forestBotAPI.websocket?.sendPlayerJoin({
//     //     uuid: uuid,
//     //     server: "simplyvanilla",
//     //     timestamp: Date.now().toString(),
//     //     username: "neofetching"
//     // })

// })();