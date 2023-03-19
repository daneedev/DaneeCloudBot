const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")

new Command({
	name: 'clear',
	description: 'Clear messages',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "amount",
            description: "Amount of messages",
            type: ArgumentType.INTEGER,
            required: true
        })
    ],
	run: async (ctx) => {
		const amount = ctx.arguments.getInteger("amount")
        const deleteMessages = ctx.channel.bulkDelete(amount, true)
        const embed = new Discord.EmbedBuilder()
        .setColor("#5D3FD3")
        .setTitle(`${amount.toString()} messages has been deleted`)
        ctx.reply({embeds: [embed], ephemeral: true})
    }
})