const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;

new Command({
	name: 'delfolder',
	description: 'Delete a folder',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "username",
            description: "Username of user",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "name",
            description: "Name of folder",
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
		const name = ctx.arguments.getString("name")
        const username = ctx.arguments.getString("username")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const deletefolder = await cloud.deleteFolder(username, name)
            if (deletefolder.code == 200) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Folder ${name} has been deleted`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
           } else if (deletefolder.code == 401) {
            const err = new Discord.EmbedBuilder()
            .setTitle("API: Invalid API Key")
            .setColor("#FF9494")
        ctx.reply({ embeds: [err], ephemeral: true})
           } else if (deletefolder.code == 404) {
            const err = new Discord.EmbedBuilder()
            .setTitle(deletefolder.data)
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