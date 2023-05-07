const { Listener } = require('gcommands');
const Discord = require("discord.js")
const {Cloud} = require("daneecloud-api")
const cloud = Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

new Listener({
	name: 'interactionCreate',
	event: 'interactionCreate',
	run: async (interaction) => {
        if (interaction.customId === 'registration') {
            if (!interaction.isModalSubmit()) return;
            const username = interaction.fields.getField("usernameInput").value
            const email = interaction.fields.getField("emailInput").value
            const password = interaction.fields.getField("passwordInput").value
            const createUser = await cloud.createUser(username, email, password)
                if (createUser.code == 401) {
                    const errorembed = new Discord.EmbedBuilder()
                    .setColor("#FF9494")
                    .setTitle("API: Invalid API Key")
                    interaction.reply({embeds: [errorembed], ephemeral: true})
                } else if (createUser.code == 409) {
                    const errorembed = new Discord.EmbedBuilder()
                    .setColor("#FF9494")
                    .setTitle("User already exist")
                    interaction.reply({embeds: [errorembed], ephemeral: true})
                } else {
                    const embed = new Discord.EmbedBuilder()
                    .setColor("#5D3FD3")
                    .setTitle(`Your account has been registered`)
                    interaction.reply({embeds: [embed], ephemeral: true})
                }
        }
            
	}
});