const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

const readline = require("readline");

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("Deploy commands to: guild or delete or global ? ", answer => {
    if (answer == "delete") {
        const commandIds = ["1071134197500096653", "1071134198200533013"];
        commandIds.forEach(id => {
            // rest.delete(Routes.applicationCommand(clientId, id))
            //     .then(() => console.log("Successfully deleted application command"))
            //     .catch(console.error);
            rest.delete(Routes.applicationGuildCommand(clientId, "955139831900557312", id))
                .then(() => console.log("Successfully deleted guild command"))
                .catch(console.error);
        });
    } else {
        deployCommands(answer);
    }
	rl.close();
});

function deployCommands(answer) {
    const commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    // Grab the SlashCommandBuilder#toJSON() output of each command"s data for deployment
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const deployType = answer == "guild" ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);
            const data = await rest.put(
                deployType,
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}
