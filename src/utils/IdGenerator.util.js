const { Counter } = require("../models");

async function generateID(typeOfId) {
    // find previous count from database
    const sequentialIdCounter = await Counter.findOneAndUpdate({type:typeOfId}, {$inc: {counter:1}}, {returnOriginal:false})
    let previousCount = sequentialIdCounter.counter
    
    // get current year
    const currentYear = new Date().getFullYear();
    // generate padding number
    const formattedCounter = String(previousCount).padStart(4, '0');
    
    let membershipId;
    if(typeOfId == "member") {
        // generate final membership Id
        membershipId = `ERDA${currentYear}${formattedCounter}`;
    } else if(typeOfId == "associative") {
        membershipId = `ASS${currentYear}${formattedCounter}`
    } else if(typeOfId == "ordinary"){
        membershipId = `ORD${currentYear}${formattedCounter}`
    }

    return membershipId;
}

module.exports = {
    generateID
}
