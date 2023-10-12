const { Counter } = require("../models");

async function generateID(type) {
    // find previous count from database
    const sequentialIdCounter = await Counter.findOneAndUpdate({type}, {$inc: {counter:1}}, {returnOriginal:false})
    let previousCount = sequentialIdCounter.counter
    
    // get current year
    const currentYear = new Date().getFullYear();
    // generate padding number
    const formattedCounter = String(previousCount).padStart(4, '0');
    
    let membershipId;
    if(type == "member") {
        // generate final membership Id
        membershipId = `ERDA${currentYear}${formattedCounter}`;
    } else if(type == "associative") {
        membershipId = `ASS${currentYear}${formattedCounter}`
    } else if(type == "ordinary"){
        membershipId = `ORD${currentYear}${formattedCounter}`
    }

    return membershipId;
}

module.exports = {
    generateID
}
