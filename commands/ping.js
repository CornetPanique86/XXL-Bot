const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Get websocket heartbeat"),
	async execute(interaction) {
		await interaction.reply(`Websocket heartbeat: **${interaction.client.ws.ping}ms**.`);
	},
};
