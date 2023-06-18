const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const {Cloud} = require("daneecloud-api")
const cloud = Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

new Command({
	name: 'folders',
	description: 'Get list of all folders created by user',
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
        const folders = await cloud.getFolders(username)
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            if (folders.code == 200) {
            let allfolders = ""
            for (let folder of folders.data.folders) {
                allfolders = allfolders + `\n**/${folder}**`
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${username}'s folders`)
                .setColor("#5D3FD3")
                .setDescription(allfolders)
            ctx.reply({ embeds: [embed], ephemeral: true})
        } else if (files.code == 404) {
                const err = new Discord.EmbedBuilder()
                .setTitle("User not found")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
        
        } else if (files.code == 401) {
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
