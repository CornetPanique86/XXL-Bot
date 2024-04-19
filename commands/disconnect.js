const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect the bot and stop streaming audio')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (connection !== undefined) {
            connection.destroy();
            await interaction.reply("Disconnected");
        } else {
            await interaction.reply("**Error:** please be in the same channel where the audio is streaming!");
        }
	},
};