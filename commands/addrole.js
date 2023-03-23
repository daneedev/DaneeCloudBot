const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const axios = require("axios")

new Command({
	name: 'addrole',
	description: 'Create a role',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "name",
            description: "Name of role",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "maxstorage",
            description: "Max storage (In MB)",
            type: ArgumentType.NUMBER,
            required: true
        }),
    ],
	run: async (ctx) => {
		const name = ctx.arguments.getString("name")
        const maxStorage = ctx.arguments.getNumber("maxstorage")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const addrole = await axios.post(process.env.cloud_url + `/api/role/create?name=${name}&maxStorage=${maxStorage.toString()}`, {}, {
                headers: { "API-Key" : process.env.api_key},
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            })
            if (addrole.status == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Role ${name} has been created`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (addrole.status == 409) {
                    const err = new Discord.EmbedBuilder()
                    .setTitle("Role already exist")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
            
           } else if (addrole.status == 401) {
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
