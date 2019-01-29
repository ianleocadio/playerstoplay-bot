const rp = require('request-promise');
const Embeds = require("../../embeds/embeds.js");
const WorldState = require("../../models/WorldState");
const Utils = require("../../../../util/utils");

class AlertItem{

    constructor(item, channel, author = null, createdAt = null){
        this.id = item;
        this.delay = 10000;
        this.isRunning = false;
        this.found = false;
        this.interval = null;
        this.alerts = null;
        this.channel = channel;
        this.createdAt = createdAt;
        this.author = author;
    }

    run(){
        if (this.isRunning || this.found) return;

        let item = this;

        this.interval = setInterval(function f() {
            item.isRunning = true;
            rp('http://content.warframe.com/dynamic/worldState.php')
                .then(function (response) {
                    let ws = new WorldState(response);
                    let alerts = ws.alerts.filter(a => a.rewardTypes.includes(item.id));
                    if (alerts.length < 1) {                        
                        if (item.found) item.updateTime(f, item.delay);
                        item.found = false; 
                        return;
                    }
                    item.found = true;
                    item.alerts = alerts;
                    let alertEmbed = new Embeds.AlertEmbed(item.alerts, "PC");
                    item.channel.send(alertEmbed.showAlerts());
                    if (alerts.some(i=>i.active)) {
                        let max = 0;
                        item.alerts.map(a=>{
                            let aConverted = Utils.convertEta(a.eta);
                            if(aConverted > max)
                                max = aConverted;
                        });
                        console.log(max);
                        item.updateTime(f, max);
                    }

                })
                .catch(function (err) {
                    //
                });
            return f;
        }(), this.delay);
    }

    stop(){
        clearInterval(item.interval);
        item.isRunning = false;
    }

    updateTime(f, interval, needConvert = false){
        if (needConvert){
            interval = Utils.convertEta(interval)
        }
        clearInterval(this.interval);
        let item = this;
        this.interval = setInterval(f, interval);
    }

    

}

module.exports = AlertItem;