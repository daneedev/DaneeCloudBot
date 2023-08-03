const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;

new Command({
	name: 'share',
	description: 'Share a file',
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
        })
    ],
	run: async (ctx) => {
		const username = ctx.arguments.getString("username")
        const file = ctx.arguments.getString("filename")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const sharefile = await cloud.shareFile(username, file)
            if (sharefile.code == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`File ${file} has been shared!`)
                .setDescription(`Link: ${process.env.cloud_url}/sf/${username}/${file}`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (sharefile.code == 404) {
                if (sharefile.data == "File not found") {
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
           } else if (sharefile.code == 409) {
            const err = new Discord.EmbedBuilder()
            .setTitle("File is already shared")
            .setColor("#FF9494")
        ctx.reply({ embeds: [err], ephemeral: true})
           } else if (sharefile.code == 401) {
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
