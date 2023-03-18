const { Listener } = require('gcommands');
const Discord = require("discord.js")
const axios = require("axios")

new Listener({
	name: 'interactionCreate',
	event: 'interactionCreate',
	run: async (interaction) => {
        if (interaction.customId === 'registration') {
            if (!interaction.isModalSubmit()) return;
            const username = interaction.fields.getField("usernameInput").value.toString()
            const findUser = await axios.get(process.env.cloud_url + "/api/user/", {
                headers: { "API-Key" : process.env.api_key},
                params: { username: username}
            })
            if (findUser.status == 200) {
                const errorembed = new Discord.EmbedBuilder()
                .setColor("#FF9494")
                .setTitle("User with this username already exist!")
                interaction.reply({embeds: [errorembed], ephemeral: true})
            } else {
            const registerembed = new Discord.EmbedBuilder()
            .setColor("#5D3FD3")
            .setTitle("Your account was registered!")
            interaction.reply({embeds: [registerembed], ephemeral: true})
            const email = interaction.fields.getField("emailInput").value.toString()
            const password = interaction.fields.getField("passwordInput").value.toString()
            const createUser = await axios.post(process.env.cloud_url + `/api/user/create?username=${username}&email=${email}&password=${password}`, {}, {
                headers: { "API-Key" : process.env.api_key},
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            })
        }
            }
	}
});