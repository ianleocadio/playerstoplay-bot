"use strict";

const RichEmbed = require("discord.js").RichEmbed;

/**
 * Utility class for making rich embeds
 */
class BaseEmbed extends RichEmbed{
  constructor() {
    super();
    this.url = "https://warframestat.us/";
    this.footer = {
      text: "Sent",
      iconUrl: "https://warframestat.us/wfcd_logo_color.png"
    };
    this.fields = [];
    this.timestamp = new Date();
  }
}

module.exports = BaseEmbed;