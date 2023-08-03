const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;

new Command({
	name: 'users',
	description: 'Get info about all users',
	type: [CommandType.SLASH],
	run: async (ctx) => {
        const users = await cloud.getUsers()
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            if (users.code == 200) {
            let usernames = ""
            for (let user of users.data) {
                usernames = usernames + `\n**${user.username}** | ${user.email} `
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle("All users")
                .setColor("#5D3FD3")
                .setDescription(usernames)
            ctx.reply({ embeds: [embed], ephemeral: true})
        } else if (users.code == 401) {
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
