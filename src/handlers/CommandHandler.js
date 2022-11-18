const { Client } = require('discord.js')


function loadCommands(client) {
    const ascii = require('ascii-table')
    const fs = require('fs')
    const table = new ascii().setHeading("Commands", "Type", "Status")

    let commandsArray = [];
    let developerArray = [];

    const commandsFolder = fs.readdirSync("./src/types/commands");

    for(const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./src/types/commands/${folder}/`)
        .filter((file) => file.endsWith('.js'));

        for(const file of commandFiles) {
            const commandFile = require(`../types/commands/${folder}/${file}`);

            client.commands.set(commandFile.data.name, commandFile);

           
            if(commandFile.developer) developerArray.push(commandFile.data.toJSON())
            else commandsArray.push(commandFile.data.toJSON());

            table.addRow(file, folder, '✅');
            continue;
        }
    }

   
    client.application.commands.set(commandsArray);

    
    if(client.config.developerGuild) {
        const developerGuild = client.guilds.cache.get(client.config.developerGuild)
        developerGuild.commands.set(developerArray);
    } else {
        console.log('No Developer Guild found')
    }

    return console.log(table.toString());
}

module.exports = { loadCommands }
