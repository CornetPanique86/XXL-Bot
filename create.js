const readline = require("readline");
const fs = require("node:fs");
const path = require("node:path");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const eventsPath = path.join(__dirname, "events");
const eventsContent =
`const { Events } = require("discord.js");

module.exports = {
	name: Events.Event,
	execute(client) {
        return;
	},
}`;

const commandsPath = path.join(__dirname, "commands");
const commandsContent =
`const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("name")
		.setDescription("Description"),
	async execute(interaction) {
		await interaction.reply("Reply");
	},
}`;

rl.question("Create a new command or event? ", answer => {
    rl.close();
    rl.question("Name: ", answer2 => {
        rl.close();
        console.log(answer2);
        switch (answer) {
            case "event":
                if (!fs.existsSync(path.join(eventsPath, (answer2 + ".js")))) return;
                fs.writeFile(path.join(path.join(eventsPath, (answer2 + ".js"))), eventsContent, err => {
                    if (err) return console.error(err);
                    return console.log("File created successfully.");
                });
                break;
            // Case "command"
            default:
                if (!fs.existsSync(path.join(commandsPath, (answer2 + ".js")))) return;
                fs.writeFile(path.join(commandsPath, (answer2 + ".js")), commandsContent, err => {
                    if (err) return console.error(err);
                    return console.log("File created successfully.");
                });
                break;
        }
    });
});
