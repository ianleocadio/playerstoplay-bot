const WorldStateParser = require('warframe-worldstate-parser');


class WorldState extends WorldStateParser{

    constructor(wsd){
        super(wsd);
    };

}

module.exports = WorldState;