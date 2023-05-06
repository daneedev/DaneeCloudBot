const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const {Cloud} = require("daneecloud-api")
const cloud = Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

new Command({
	name: 'verifyuser',
	description: 'Send a verification email to user',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "username",
            description: "Username of user",
            type: ArgumentType.STRING,
            required: true
        }),
    ],
	run: async (ctx) => {
		const username = ctx.arguments.getString("username")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const user = await axios.post(process.env.cloud_url + `/api/user/verify?username=${username}`, {}, {
                headers: { "API-Key" : process.env.api_key},
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            })
            if (user.status == 200) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Verification email to ${username} has been send`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (user.status == 404) {
                const err = new Discord.EmbedBuilder()
                .setTitle("User not found")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
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
