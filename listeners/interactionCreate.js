const { Listener } = require('gcommands');
const Discord = require("discord.js")
const axios = require("axios")

new Listener({
	name: 'interactionCreate',
	event: 'interactionCreate',
	run: async (interaction) => {
        if (interaction.customId === 'registration') {
            if (!interaction.isModalSubmit()) return;
            const username = interaction.fields.getField("usernameInput").value
            const email = interaction.fields.getField("emailInput").value
            const password = interaction.fields.getField("passwordInput").value
            const createUser = await axios.post(process.env.cloud_url + `/api/user/create?username=${username}&password=${password}&email=${email}`, {}, {
                    headers: { "API-Key" : process.env.api_key},
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if the status code is less than 500
                    }
                })
                if (createUser.status == 401) {
                    const errorembed = new Discord.EmbedBuilder()
                    .setColor("#FF9494")
                    .setTitle("API: Invalid API Key")
                    interaction.reply({embeds: [errorembed], ephemeral: true})
                } else if (createUser.status == 409) {
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