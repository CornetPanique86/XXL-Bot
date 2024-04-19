const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Voice = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');


const musicPath = path.join(__dirname, "..", "music");
const allMusic = getFilesFromDir(musicPath);
let notPlayed = [...allMusic];

const player = Voice.createAudioPlayer({
	behaviors: {
		noSubscriber: Voice.NoSubscriberBehavior.Pause,
	},
});

function getFilesFromDir(dir) {
    let files = [];

    // Read contents of the directory
    const dirContents = fs.readdirSync(dir);

    // Iterate through directory contents
    for (const item of dirContents) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        // If it's a directory, recursively call the function
        if (stat.isDirectory()) {
            files = files.concat(getFilesFromDir(itemPath));
        } else {
            // If it's a file, push its metadata to the array
			const ext = path.extname(item);
            if (ext === '.ogg') {
            	const fileName = path.parse(item).name;
            	const artist = path.basename(dir);
            	files.push({ title: fileName, artist: artist });
			}
        }
    }

    return files;
}

function getRandomAudio() {
	if (notPlayed.length === 0) notPlayed = [...allMusic];
    // Generate a random index within the range of the array length
    const randomIndex = Math.floor(Math.random() * notPlayed.length);
    // Return the randomly selected audio object
    return notPlayed[randomIndex];
}

function playRandomMusic() {
	const music = getRandomAudio();
	module.exports.nowplaying = music;
	notPlayed.filter(item => item !== music); // Remove the music from array
	console.log(path.join(musicPath, music.artist, music.title + ".ogg"));
	return Voice.createAudioResource(path.join(musicPath, music.artist, music.title + ".ogg"), {
		inputType: Voice.StreamType.OggOpus,
	});
}

player.on(Voice.AudioPlayerStatus.Idle, () => {
	setTimeout(() => {
		player.play(playRandomMusic());
	}, 2_500);
});
player.on(Voice.AudioPlayerStatus.AutoPaused, () => {
	module.exports.nowplaying = null;
});

player.on('error', error => {
	console.error(`Error: ${error.message} with resource ${error.resource}`);
});

module.exports = {
	nowplaying: null,
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Start streaming music')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.deferReply();
		if (interaction.member.voice.channel) {
			channel = interaction.member.voice.channel;
			const connection = Voice.joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
			if (connection === undefined) {
				await interaction.editReply("**Error:** could not join voice channel");
				return;
			}
			
			connection.subscribe(player);

			const music = getRandomAudio();
			player.play(Voice.createAudioResource(path.join(musicPath, music.artist, music.title + ".ogg"), {
				inputType: Voice.StreamType.OggOpus,
			}));

			connection.on(Voice.VoiceConnectionStatus.Ready, async () => {
				module.exports.nowplaying = music;
				console.log('Ready to play audio!');
				await interaction.editReply("Started streaming audio");
			});
			connection.on(Voice.VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
				try {
					await Promise.race([
						Voice.entersState(connection, Voice.VoiceConnectionStatus.Signalling, 5_000),
						Voice.entersState(connection, Voice.VoiceConnectionStatus.Connecting, 5_000),
					]);
					// Seems to be reconnecting to a new channel - ignore disconnect
				} catch (error) {
					// Seems to be a real disconnect which SHOULDN'T be recovered from
					connection.destroy();
					await interaction.editReply("**Error:** streaming audio failed");
				}
			});
		} else {
			await interaction.editReply("**Error:** You're not in a voice channel!");
		}
	},
};