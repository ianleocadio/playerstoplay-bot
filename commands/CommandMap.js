class CommandMap extends Map{
    constructor(){
        super();
    }

    getCommandImplementation(command){
        //console.log(this);
        for (let [key, func] of this.entries()) {
            if (command.match(key)){
                return func;
            }
        }
        return null;
    }
}

module.exports = CommandMap;
