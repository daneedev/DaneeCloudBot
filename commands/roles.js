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
        const therole = await axios.get(process.env.cloud_url + `/api/role/all`, {
            headers: { "API-Key" : process.env.api_key},
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        })
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            if (therole.status == 200) {
                let roles = ""
            for (let role of therole.data) {
                roles = roles + `\n**${role.name}** | ${role.maxStorage.toString()} MB`
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle("All roles")
                .setDescription(roles)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (user.status == 404) {
                const err = new Discord.EmbedBuilder()
                .setTitle("Role not found")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
           } else if (user.status == 401) {
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
