const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const {Cloud} = require("daneecloud-api")
const cloud = Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

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
            const renfile = await axios.post(process.env.cloud_url + `/api/files/rename?username=${username}&file=${file}&newname=${newfile}`, {}, {
                headers: { "API-Key" : process.env.api_key},
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            })
            if (renfile.status == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`File ${file} has been renamed`)
                .addFields(
                    { name: "Old name", value: file, inline: true},
                    { name: "New name", value: newfile, inline: true}
                )
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (renfile.status == 404) {
                if (renfile.data.error == "Error 404 - File not found") {
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
           } else if (renfile.status == 401) {
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
