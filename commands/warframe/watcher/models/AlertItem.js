const rp = require('request-promise');
const Embeds = require("../../embeds/embeds.js");
const WorldState = require("../../models/WorldState");

class AlertItem{

    constructor(item, channel){
        this.id = item;
        this.delay = 10000;
        this.isRunning = false;
        this.founded = false;
        this.interval = null;
        this.alerts = null;
        this.channel = channel;
    }

    run(){
        if (this.isRunning || this.founded) return;

        let item = this;
        this.interval = setInterval(function f() {
            item.isRunning = true;
             if (item.founded) {
                return;
            }
            rp('http://content.warframe.com/dynamic/worldState.php')
                .then(function (response) {
                    let ws = new WorldState(response);
                    let alerts = ws.alerts.filter(a => a.rewardTypes.includes(item.id));
                    if (alerts.length > 0) {
                         item.founded = true;
                         item.alerts = alerts;
                         
                         let alertEmbed = new Embeds.AlertEmbed(item.alerts, "PC");
                         console.log(item);
                         item.channel.send(alertEmbed.showAlerts());
                         if (item.active)
                            item.updateTime(item[0].eta, true);
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

    updateTime(interval, needConvert = false){
        
        if (needConvert){
            interval = interval.split(" ");
            m = interval[0].replace("m", "");
            s = interval[1].replace("s", "");
            interval = m*60000 + s*1000;
        }
        this.interval._repeat = interval;
        
    }

    

}

module.exports = AlertItem;