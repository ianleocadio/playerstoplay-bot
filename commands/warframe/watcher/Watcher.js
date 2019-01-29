const Embeds = require("../embeds/embeds.js");
const AlertItem = require("./models/AlertItem");

let instance;
class Watcher {


     constructor(channel) {
          if (instance){
               return instance;
          }
          instance = this;
          this.items = new Map();
          this.channel = channel;
     }

     push(item){
          let o = new AlertItem(item, this.channel);
          this.items.set(item, o);
          this.runAll();
     }

     stop(item){
          item = this.items.get(item);
          if (item){
               item.stop();
          }
     }

     listCurrentAlerts(){
          //let alertEmbed = new Embeds.AlertEmbed(this.items, "PC");
          this.channel.send(this.items);
     }

     runAll(){
          this.items.forEach(i=>i.run());
     }

}


module.exports = Watcher;