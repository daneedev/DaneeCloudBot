const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const axios = require("axios")

new Command({
	name: 'editrole',
	description: 'Edit a role',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "name",
            description: "Name of role",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "newname",
            description: "New name of role",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "maxstorage",
            description: "New amount of maxStorage",
            type: ArgumentType.NUMBER,
            required: true
        }),
    ],
	run: async (ctx) => {
		const rolename = ctx.arguments.getString("name")
        const newname = ctx.arguments.getString("newname")
        const maxStorage = ctx.arguments.getNumber("maxstorage")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const editrole = await axios.post(process.env.cloud_url + `/api/role/edit?name=${rolename}&newname=${newname}&maxStorage=${maxStorage.toString()}`, {}, {
                headers: { "API-Key" : process.env.api_key},
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            })
            if (editrole.status == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Role ${rolename} has been edited`)
                .addFields(
                    { name: "Old name", value: rolename, inline: true},
                    { name: "New name", value: newname, inline: true},
                    { name: "New maxStorage", value: `${maxStorage.toString()} MB`, inline: true}
                )
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (editrole.status == 404) {
                const err = new Discord.EmbedBuilder()
                    .setTitle("Role not found")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
           } else if (editrole.status == 401) {
            const err = new Discord.EmbedBuilder()
            .setTitle("API: Invalid API Key")
            .setColor("#FF9494")
        ctx.reply({ embeds: [err], ephemeral: true})
           } else if (editrole.status == 409) {
            const err = new Discord.EmbedBuilder()
            .setTitle(`You can't edit ${rolename} role`)
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
