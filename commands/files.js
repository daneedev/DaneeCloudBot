const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const axios = require("axios")

new Command({
	name: 'files',
	description: 'Get list of all uploaded files of user',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "username",
            description: "Username of user",
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
        const username = ctx.arguments.getString("username")
        const files = await axios.get(process.env.cloud_url + `/api/files?username=${username}`, {
            headers: { "API-Key" : process.env.api_key},
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        })
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            if (files.status == 200) {
            let allfiles = ""
            for (let file of files.data.files) {
                allfiles = allfiles + `\n**${file}**`
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${username}'s files`)
                .setColor("#5D3FD3")
                .setDescription(allfiles)
            ctx.reply({ embeds: [embed], ephemeral: true})
        } else if (files.status == 404) {
                const err = new Discord.EmbedBuilder()
                .setTitle("User not found")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
        
        } else if (files.status == 401) {
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
