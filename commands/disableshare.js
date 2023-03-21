const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const axios = require("axios")

new Command({
	name: 'disableshare',
	description: 'Set file as not shared',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "username",
            description: "Username of user",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "filename",
            description: "Name of shared file",
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
		const username = ctx.arguments.getString("username")
        const file = ctx.arguments.getString("filename")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const sharefile = await axios.post(process.env.cloud_url + `/api/files/noshare?username=${username}&file=${file}`, {}, {
                headers: { "API-Key" : process.env.api_key},
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            })
            if (sharefile.status == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`File ${file} isn't shared now`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (sharefile.status == 404) {
                if (sharefile.data.error == "Error 404 - File not found") {
                    const err = new Discord.EmbedBuilder()
                    .setTitle("File not found")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
                } else if (sharefile.data.error == "Error 404 - User not found") { 
                    const err = new Discord.EmbedBuilder()
                    .setTitle("User not found")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
                } else {
                    const err = new Discord.EmbedBuilder()
                    .setTitle("File isn't shared.")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
                }
           } else if (sharefile.status == 401) {
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
