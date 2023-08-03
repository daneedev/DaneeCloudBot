const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;

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
        new Argument({
            name: "badgeurl",
            description: "URL of badge",
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
		const name = ctx.arguments.getString("name")
        const maxStorage = ctx.arguments.getNumber("maxstorage")
        const badgeurl = ctx.arguments.getString("badgeurl")
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            const addrole = await cloud.createRole(name, maxStorage, badgeurl)
            if (addrole.code == 201) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Role ${name} has been created`)
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (addrole.code == 409) {
                    const err = new Discord.EmbedBuilder()
                    .setTitle("Role already exist")
                    .setColor("#FF9494")
                ctx.reply({ embeds: [err], ephemeral: true})
            
           } else if (addrole.code == 401) {
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