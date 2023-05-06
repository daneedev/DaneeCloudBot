const { Command, CommandType } = require('gcommands');
const Discord = require("discord.js")
const request = require("request")
const cloud = require("../index")
const packages = require("../package.json")

new Command({
	name: 'info',
	description: 'Get info about bot and dash',
	type: [CommandType.SLASH],
	run: async (ctx) => {
        const dash = await axios.get(process.env.cloud_url + `/api/dash/`, {
            headers: { "API-Key" : process.env.api_key},
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        })
        request.get("https://version.daneeskripter.dev/daneecloud/version.txt", function (error, response, body) {
        request.get("https://version.daneeskripter.dev/daneecloudbot/version.txt", function (error2, response2, body2) {
        const embed = new Discord.EmbedBuilder()
        .setColor("#5D3FD3")
        .setTitle("Info")
        .addFields(
            {name: "Dash CPU Usage", value: dash.data.cpuUsage, inline: true},
            {name: "Dash RAM Usage", value: dash.data.ramUsage, inline: true},
            {name: "Dash Uptime", value: dash.data.uptime, inline: true},
            {name: "Dash Current version", value: dash.data.version, inline: true},
            {name: "Dash Latest version", value: `v${body}`, inline: true},
            {name: "Bot Current version", value: `v${packages.version}`, inline: true},
            {name: "Bot Latest version", value: `v${body2}`, inline: true},
            {name: "Developer", value: dash.data.developer, inline: true},
        )
        ctx.reply({ embeds: [embed], ephemeral: true})
    })
        })
	}
});
