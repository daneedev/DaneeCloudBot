const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const {Cloud} = require("daneecloud-api")
const cloud = Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

new Command({
	name: 'delrole',
	description: 'Delete role',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "name",
            description: "Name of role",
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
        const rolename = ctx.arguments.getString("name")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const delrole = await cloud.deleteRole(rolename)
            if (delrole.code == 200) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Role ${rolename} has been deleted`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (delrole.code == 404) {
                    const err = new Discord.EmbedBuilder()
                    .setTitle("Role not found")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
           } else if (delrole.code == 401) {
            const err = new Discord.EmbedBuilder()
            .setTitle("API: Invalid API Key")
            .setColor("#FF9494")
        ctx.reply({ embeds: [err], ephemeral: true})
           } else if (delrole.code == 409) {
            const err = new Discord.EmbedBuilder()
            .setTitle(`You can't delete ${rolename} role`)
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
