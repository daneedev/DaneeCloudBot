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
        .setDescription(`**👤 User**\n**/user** - Get info about user\n**/users** - Get list of all users\n**/register** - Register new account\n**/edituser** - Edit a user account\n**/deluser** - Delete a user account\n**/userrole** - Change user's role\n**/verifyuser** - Send verification email to user\n\n**💿 Files**\n**/files** - Show user's files\n**/renfile** - Rename a file\n**/delfile** - Delete a file\n**/share** - Share a file\n**/disableshare** - Set file as not shared\n\n**🎫 Roles**\n**/roles** - Get list of roles\n**/addrole** - Create new role\n**/delrole** - Delete role\n**/editrole** - Edit role\n\n**☁️ Dash**\n**/info** - Get info about bot and dash\n\n**📂 Folders**\n**/folders** - Get list of user's folders\n**/folderfiles** - Show content of folder\n**/createfolder** - Create new folde\n**/delfolder** - Delete existing folder\n**/renfolderfile** - Rename a file in folder\n**/delfolderfile** - Delete a file in folder\n\n**📳 Moderation**\n**/clear** - Clear messages in channel`)
        ctx.reply({ embeds: [embed], ephemeral: true})
	}
});
