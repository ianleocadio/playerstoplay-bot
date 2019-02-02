const AlertEmbed = require("./AlertEmbed.js");
const BaseEmbed = require("./BaseEmbed.js");
const assetBase = "https://cdn.warframestat.us/genesis";
const Utils = require("../../../util/utils");

const alertThumb = `${assetBase}/img/alert.png`;

class StatusAlertWatcherEmbed extends BaseEmbed {
    /**
     * @param {Array.<Alert>} alerts - The alerts to be included in the embed
     */
    constructor(item) {
      super();
      this.item = item;
  
    }

    show() {
        this.thumbnail = {
            url: `${assetBase}/img/outage.png`
        };

        this.color = "#fa727b";
        this.title = "Alert Watcher";
        this.fields.push({ name: "Category", value: `${this.item.id}`, inline: true });
        if (this.item.isRunning) {
            if (this.item.found) {
                this.fields.push({ name: "Found ?", value: "Yes", inline: true });
                let date = Utils.formatDate(this.item.alerts[0].expiry);
                date = `${date.dayString}, ${date.day} ${date.monthString} ${date.year} at ${date.hours}:${date.minutes}`;
                this.fields.push({ name: "Status:", value: `Will started again on ${date}`, inline: true });
                
                this.fields.push({ name: "Current Worldstate - Alerts", value: "", inline: false });
                let activeAlerts = (new AlertEmbed(this.item.alerts, "PC")).showStatus();
                if (activeAlerts.length > 0){
                    activeAlerts.map((aa) => {
                        this.fields.push(aa);
                    });
                }

            } else {
                this.fields.push({ name: "Found ?", value: "No", inline: true });
                this.fields.push({ name: "Status", value: "Waiting for the alert appears", inline: true });
            }
        } else {
            if (this.item.found) {
                this.fields.push({ name: "Found ?", value: "Yes", inline: true });
                this.fields.push({ name: "Status", value: "Stopped", inline: true });
            } else {
                this.fields.push({ name: "Found ?", value: "No", inline: true });
                this.fields.push({ name: "Status", value: "Stopped", inline: true });
            }
        }

        this.footer.text = "Created at ";
        this.timestamp = this.item.createdAt;


        // compact
        /** if (this.alerts.length > 1) {
           this.fields = this.alerts.map(a => ({
             name: `${a.mission.reward.asString} | ${a.eta} left`,
             value: `${a.mission.faction} ${a.mission.type} on ${a.mission.node}\n`
               + `level ${a.mission.minEnemyLevel} - ${a.mission.maxEnemyLevel}\n\u200B`,
           }));
           
         } else { // divided
           const a = this.alerts[0];
           this.title = `[${this.platform.toUpperCase()}] ${a.mission.reward.itemString || `${a.mission.reward.credits} Credits`}`;
           this.color = a.mission.reward.color;
           this.thumbnail.url = a.mission.reward.thumbnail;
           const summary = `${a.mission.faction} ${a.mission.type} on ${a.mission.node}`;
           this.description = a.description;
     
           this.fields = [];
           if (this.description !== summary) {
             this.fields.push({ name: "Mission", value: `${a.mission.faction} ${a.mission.type}`, inline: true });
             this.fields.push({ name: "Location", value: a.mission.node, inline: true });
           }
           this.fields.push({ name: "Levels:", value: `${a.mission.minEnemyLevel} - ${a.mission.maxEnemyLevel}`, inline: true });
     
           this.fields.push({ name: "Archwing Required", value: a.mission.archwingRequired ? "Yes" : "No", inline: true });
     
           if (this.title.indexOf("Cr") === -1) {
             this.fields.push({ name: "\u200B", value: `**Credits:** ${a.mission.reward.credits}`, inline: true });
           }
           this.footer.text = `${a.eta} remaining • Expires `;
           this.timestamp = a.expiry;
         }*/
        return this;
    }
}

module.exports = StatusAlertWatcherEmbed;