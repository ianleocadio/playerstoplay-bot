'use strict';

const BaseEmbed = require('./BaseEmbed.js');
const assetBase = 'https://cdn.warframestat.us/genesis';

const alertThumb = `${assetBase}/img/alert.png`;

/**
 * Generates alert embeds
 */
class AlertEmbed extends BaseEmbed {
  /**
   * @param {Array.<Alert>} alerts - The alerts to be included in the embed
   * @param {string} platform - platform
   */
  constructor(alerts, platform) {
    super();
    this.alerts = alerts;
    this.platform = platform;

  }

  showAlerts() {

    this.thumbnail = {
      url: alertThumb,
    };
    this.color = 0xF1C40F;
    // compact
    if (this.alerts.length > 1) {
      this.fields = this.alerts.map(a => ({
        name: `${a.mission.reward.asString} | ${a.eta} left`,
        value: `${a.mission.faction} ${a.mission.type} on ${a.mission.node}\n`
          + `level ${a.mission.minEnemyLevel} - ${a.mission.maxEnemyLevel}\n\u200B`,
      }));
      this.title = `[${this.platform.toUpperCase()}] Worldstate - Alerts`;
    } else { // divided
      const a = this.alerts[0];
      this.title = `[${this.platform.toUpperCase()}] ${a.mission.reward.itemString || `${a.mission.reward.credits} Credits`}`;
      this.color = a.mission.reward.color;
      this.thumbnail.url = a.mission.reward.thumbnail;
      const summary = `${a.mission.faction} ${a.mission.type} on ${a.mission.node}`;
      this.description = a.description;

      this.fields = [];
      if (this.description !== summary) {
        this.fields.push({ name: 'Mission', value: `${a.mission.faction} ${a.mission.type}`, inline: true });
        this.fields.push({ name: 'Location', value: a.mission.node, inline: true });
      }
      this.fields.push({ name: 'Levels:', value: `${a.mission.minEnemyLevel} - ${a.mission.maxEnemyLevel}`, inline: true });

      this.fields.push({ name: 'Archwing Required', value: a.mission.archwingRequired ? 'Yes' : 'No', inline: true });

      if (this.title.indexOf('Cr') === -1) {
        this.fields.push({ name: '\u200B', value: `**Credits:** ${a.mission.reward.credits}`, inline: true });
      }
      this.footer.text = `${a.eta} remaining • Expires `;
      this.timestamp = a.expiry;
    }

    return this;
  }

}

module.exports = AlertEmbed;