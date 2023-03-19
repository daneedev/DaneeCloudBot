const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const axios = require("axios")

new Command({
	name: 'users',
	description: 'Get info about all users',
	type: [CommandType.SLASH],
	run: async (ctx) => {
        const users = await axios.get(process.env.cloud_url + "/api/user/all", {
            headers: { "API-Key" : process.env.api_key},
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        })
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            if (users.status == 200) {
            let usernames = ""
            for (let user of users.data) {
                usernames = usernames + `\n**${user.username}** | ${user.email} `
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle("All users")
                .setColor("#5D3FD3")
                .setDescription(usernames)
            ctx.reply({ embeds: [embed], ephemeral: true})
        } else if (user.status == 401) {
            const err = new Discord.EmbedBuilder()
            .setTitle("API: Invalid API Key")
            .setColor("#FF9494")
        ctx.reply({ embeds: [err], ephemeral: true})
        }
        } else {
            const err = new Discord.EmbedBuilder()
                .setTitle("You have no permission to do that.")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
        }
	}
});
