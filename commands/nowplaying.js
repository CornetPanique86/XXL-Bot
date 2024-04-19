const { SlashCommandBuilder } = require('discord.js');

function capitalizeWords(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\b\w/g, match => match.toUpperCase());
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Info on the music which is currently playing.'),
	async execute(interaction) {
        const { nowplaying } = require("./play");
        if (nowplaying) {
            const nowplayingEmbed = {
                color: 0x4A3C5C,
                title: 'Currently playing',
                description: capitalizeWords(nowplaying.title),
                fields: [{
                    name: 'Artist:',
                    value: nowplaying.artist,
                }],
                timestamp: new Date().toISOString()
            };
            await interaction.reply({ embeds: [nowplayingEmbed] });
        } else if (nowplaying === null) {
            await interaction.reply("Currently not playing anything.");
        } else {
            await interaction.reply("**Error:** Current music unknown");
        }
		
	},
};