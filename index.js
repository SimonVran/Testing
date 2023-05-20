const { Client, Events, IntentsBitField, messageLink, GatewayIntentBits } = require('discord.js');
const token = "**.GkPEaN.dZ4uvhkMQOGs66zbeZIFLZlInudg6MeaKSP_GE";
const prefix = "+"
const ytdl = require("ytdl-core")
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

var connection = 0

var version = "1.2.3"

var servers = []

const bot = new Client({ intents: [
	IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, GatewayIntentBits.GuildVoiceStates
] });

bot.once(Events.ClientReady, c => {
	console.log("Ready! Logged in as " + bot.user.tag);
	
});

bot.on("messageCreate", msg => {
	if(msg.author.tag !== bot.user.tag){

		let args = msg.content.substring(prefix.length).split(" ")


		switch(args[0].toLocaleLowerCase()){

			case "version":
				msg.channel.send("Version " + version);
				return;

			case "play":
				if(!args[1]){
					msg.channel.send("You need to provide a valid YouTube link.");
					return;
				}else{
					if(!(args[1].substring(0, 5) === "https" || args[1].substring(0, 3) === "www")){
						msg.channel.send("'" + args[1] + "'" + " is not a valid YouTube link.");
						return;
					};
				};

				if(!msg.member.voice.channel){
					console.log(msg.content);
					msg.channel.send("You are required to be in a channel to be able to play music.");
					return;
				}

				if(!servers[msg.guild.id]) servers[msg.guild.id] = {
					queue: []
				}

				connection = joinVoiceChannel({
					channelId: msg.member.voice.channel.id,
					guildId: msg.guild.id,
					adapterCreator: msg.guild.voiceAdapterCreator
				});
				
				const stream = ytdl(args[1], {filter: "audioonly"});
				const player = createAudioPlayer();
				const resource = createAudioResource(stream);

				player.play(resource);
				connection.subscribe(player);

				msg.channel.send("Now playing *that song*")
				console.log("Playing a new song")
				return;

			case "disconnect":
				if(!connection){
					msg.channel.send("Currently not active in a channel")
					return;
				}
				connection.disconnect();
				msg.channel.send("Disconnected")
				console.log("Disconnected")
				return;
		};
	};
});

bot.login(token);

