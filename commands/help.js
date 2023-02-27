const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("You need help?"),
	async execute(interaction) {
		await interaction.reply({
          embeds: [
            {
              title: "Help",
              author: {
                name: "XXL Bot",
                url: "https://xxlsteve.net",
                icon_url: "cdn.discordapp.com/avatars/1071118893692764160/1071385432209de90386d435a69edec9.png",
              },
              description: "List of commands:",
              fields: [
                {
                  name: "/help",
                  value: "Get a list of commands and their use.",
                },
                {
                  name: "/user",
                  value: "Get information about a user.",
                },
                {
                  name: "/server",
                  value: "Get information about the current discord server.",
                },
                {
                  name: "/avatar",
                  value: "Get a user's avatar.",
                },
                {
                  name: "/ping",
                  value: "Get this bot's ping.",
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        });
	},
};
