const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;

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
            const user = await cloud.verifyUser(username)
            if (user.code == 200) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Verification email to ${username} has been send`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (user.code == 404) {
                const err = new Discord.EmbedBuilder()
                .setTitle("User not found")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
           } else if (user.code == 401) {
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
