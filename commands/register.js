const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

new Command({
	name: 'register',
	description: 'Register a new user',
	type: [CommandType.SLASH],
	run: async (ctx) => {
        const modal = new ModalBuilder()
        .setCustomId('registration')
        .setTitle('DaneeCloud: Registration');

        const usernameInput = new TextInputBuilder()
        .setCustomId('usernameInput')
        .setLabel("Your username")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

        const emailInput = new TextInputBuilder()
        .setCustomId('emailInput')
        .setLabel("Your email")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

        const passwordInput = new TextInputBuilder()
        .setCustomId('passwordInput')
        .setLabel("Your password (will be used for DaneeCloud)")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

        const ActionRow1 = new ActionRowBuilder().addComponents(usernameInput);
        const ActionRow2 = new ActionRowBuilder().addComponents(emailInput);
        const ActionRow3 = new ActionRowBuilder().addComponents(passwordInput);

        modal.addComponents(ActionRow1, ActionRow2, ActionRow3);

        ctx.interaction.showModal(modal)
        
	}
});
