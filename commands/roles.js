const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const {Cloud} = require("daneecloud-api")
const cloud = Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

new Command({
	name: 'roles',
	description: 'Get all roles',
	type: [CommandType.SLASH],
	run: async (ctx) => {
        const therole = await cloud.getRoles()
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            if (therole.code == 200) {
                let roles = ""
            for (let role of therole.data) {
                roles = roles + `\n**${role.name}** | ${role.maxStorage.toString()} MB`
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle("All roles")
                .setDescription(roles)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (therole.code == 404) {
                const err = new Discord.EmbedBuilder()
                .setTitle("Role not found")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
           } else if (therole.code == 401) {
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
