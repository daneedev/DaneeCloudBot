const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const {Cloud} = require("daneecloud-api")
const cloud = Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

new Command({
	name: 'renfolderfile',
	description: 'Rename a file in folder',
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
            name: "foldername",
            description: "Name of folder",
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
        const folder = ctx.arguments.getString("foldername")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const renfile = await cloud.renameFileFolder(username, folder, file, newfile)
            if (renfile.code == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`File ${file} in /${folder} has been renamed`)
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
                    .setTitle(renfile.data)
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
