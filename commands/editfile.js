const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;

new Command({
	name: 'renfile',
	description: 'Rename a file',
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
            description: "Name of file",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "newfilename",
            description: "New name of file",
            type: ArgumentType.STRING,
            required: true
        }),
    ],
	run: async (ctx) => {
		const username = ctx.arguments.getString("username")
        const file = ctx.arguments.getString("filename")
        const newfile = ctx.arguments.getString("newfilename")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const renfile = await cloud.renameFile(username, file, newfile)
            if (renfile.code == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`File ${file} has been renamed`)
                .addFields(
                    { name: "Old name", value: file, inline: true},
                    { name: "New name", value: newfile, inline: true}
                )
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (renfile.code == 404) {
                if (renfile.data == "File not found") {
                    const err = new Discord.EmbedBuilder()
                    .setTitle("File not found")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
                } else {
                    const err = new Discord.EmbedBuilder()
                    .setTitle("User not found")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
                }
           } else if (renfile.code == 401) {
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
