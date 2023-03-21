const { Command, CommandType } = require('gcommands');
const Discord = require("discord.js")

new Command({
	name: 'help',
	description: 'List all commands',
	type: [CommandType.SLASH],
	run: async (ctx) => {
        const embed = new Discord.EmbedBuilder()
        .setColor("#5D3FD3")
        .setTitle("Help")
        .setDescription(`**👤 User**\n**/user** - Get info about user\n**/users** - Get list of all users\n**/register** - Register new account\n**/edituser** - Edit a user account\n**/deluser** - Delete a user account\n**/userrole** - Change user's role\n**/verifyuser** - Send verification email to user\n\n**💿 Files**\n**/files** - Show user's files\n**/renfile** - Rename a file\n**/delfile** - Delete a file\n**/share** - Share a file\n**/disableshare** - Set file as not shared\n\n**📳 Moderation**\n**/clear** - Clear messages in channel`)
        ctx.reply({ embeds: [embed], ephemeral: true})
	}
});
