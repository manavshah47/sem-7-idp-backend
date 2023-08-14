const { Counter } = require("../models");

async function membershipIdGenerator() {
    // find previous count from database
    const sequentialIdCounter = await Counter.findOneAndUpdate({}, {$inc: {counter:1}}, {returnOriginal:false})
    let previousCount = sequentialIdCounter.counter
    
    // get current year
    const currentYear = new Date().getFullYear();
    // generate padding number
    const formattedCounter = String(previousCount).padStart(4, '0');
    
    // generate final membership Id
    const membershipId = `ERDA${currentYear}${formattedCounter}`;
    return membershipId;
}

module.exports = {
    membershipIdGenerator
}
