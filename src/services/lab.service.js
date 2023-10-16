const { Lab } = require("../models");
const moment = require("moment")

const bookLab = async (body, user) => {
    try {
        let { name, date, time, message } = body

        date = moment(date).format('MM/DD/YYYY')

        const labObject = {
            name,
            date,
            time,
            message,
            memberPhone: user.phone
        }

        const bookings = await Lab.find({name, date, time}) 

        if(bookings.length > 0) {
            return { success: false, message:"Lab is booked already" }
        }

        await Lab.create(labObject)

        return { success: true, message: "Lab booked successfully." }

    } catch (error) {
        console.log("ERR: ", error)
        return { sucess: false, message:"Internal server error" }
    }
}

const checkDateWiseAvailibility = async (body) => {
    try {
        let { name, date } = body

        startDate =  moment(date).format('MM/DD/YYYY')
        endDate = moment(date).add(30, 'days').format('MM/DD/YYYY');

        let bookings = await Lab.aggregate([
            {
                $match: {
                    date : {
                        $gte: startDate,
                        $lte: endDate
                    },
                    name
                }
            },
            {
                $group: {
                    _id: "$date",
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                count: {
                    $eq : 3
                }
                }
            },
            {
                $project: {
                    _id : 0,
                    date: "$_id"
                }
            }
        ])

        let bookedDates = bookings.map((item) => Date.parse(item.date))

        return { success: true, dates:bookedDates }

    } catch (error) {
        console.log("err: ", error)
        return { sucess: false, message:"Internal server error" }
    }
}

const checkTimeWiseAvailibility = async (body) => {
    try {
        let { name, date } = body

        date = moment(date).format('MM/DD/YYYY')

        const bookings = await Lab.find({name, date }).select({time:1})

        return { success: true, bookings }

    } catch (error) {
        return { sucess: false, message:"Internal server error" }
    }
}

const memberYearlyData = async (user) => {
    try {
        let date = moment().startOf('year').format("YYYY-MM-DD")

        let userBookings = [];
        for (let i = 0; i < 365; i++) {
            userBookings.push({date, count:0, level:0})
            date = moment(date).add(1, 'days').format("YYYY-MM-DD");
        }
        const bookings = await Lab.aggregate([
            {
                $match: {
                memberPhone: user.phone
                }
            },
            {
                $group: {
                _id: "$date",
                count: { $sum: 1 }
                }
            }
        ])

        bookings.forEach((booking) => {
            let obj = userBookings.find((b) => b.date == moment(booking._id).format("YYYY-MM-DD"))
            if(obj) {
                obj.count = booking.count
                obj.level = booking.count
            }
        })

        return { success: true, data:userBookings }
    } catch (error) {
        return { sucess: false, message:"Internal server error" }
    }
}

module.exports = {
    bookLab,
    checkDateWiseAvailibility,
    checkTimeWiseAvailibility,
    memberYearlyData
}