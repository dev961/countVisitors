const userView = require('../models/user.model');
var moment = require('moment');

// This getByMonth Method will give you last 30 days of count. 
getByMonth = async function (req, res, next, productId) {
  
        var startOfMonth = moment(new Date() - 31 * 24 * 3600 * 1000).format('YYYY-MM-DD[T00:00:00.000Z]');

        var endOfMonth = moment(new Date() - 1 * 24 * 3600 * 1000).format('YYYY-MM-DD[T23:59:00.000Z]');

    return await userView.aggregate([
        {
            $match: {
                viewDate: {
                    $gte: new Date(startOfMonth),
                    $lt: new Date(endOfMonth)
                },
                ProductId: {
                    $eq: productId
                }
            }
        },
        {
            $group: {
                _id: '$userId',
                count: { $sum: 1 }
            },
        },
        {
            $group: {
                _id: 'id',
                monthlyUsers: { $sum: 1 },
                // usersWithCount: { $push: "$$ROOT" },
                totalMonthlyUsers: {
                    $sum: '$count'
                }
            }
        }
    ], function (err, userView) {
        if (err) return next(err);
    });
};

// This getWeeklyCount Method will give you last 7 days of count. 

getWeeklyCount = async function (req, res, next, productId) {

        var startOfWeek = moment(new Date() - 8 * 24 * 3600 * 1000).format('YYYY-MM-DD[T00:00:00.000Z]');

        var endOfWeek = moment(new Date() - 1 * 24 * 3600 * 1000).format('YYYY-MM-DD[T23:59:00.000Z]');
    
    return await userView.aggregate([
        {
            $match: {
                viewDate: {
                    $gte: new Date(startOfWeek),
                    $lt:  new Date(endOfWeek)
                },
                ProductId: {
                    $eq: productId
                }
            }
        },
        {
            $group: {
                _id: '$userId',
                count: { $sum: 1 }
            },
        },
        {
            $group: {
                _id: 'id',
                weeklyUsers: { $sum: 1 },
                // usersWithCount: { $push: "$$ROOT" },
                totalWeeklyUsers: {
                    $sum: '$count'
                }
            }
        }
    ], function (err, userView) {
        if (err) return next(err);
    });

};

// This getDailyCount Method will give you daily  count. 

getDailyCount = async function (req, res, next, productId) {

    if (!req.query.date) {
        var start = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');

        var end = moment(new Date()).format('YYYY-MM-DD[T23:59:00.000Z]');
    } else {
        var start = moment(new Date(req.query.date)).format('YYYY-MM-DD[T00:00:00.000Z]');

        var end = moment(new Date(req.query.date)).format('YYYY-MM-DD[T23:59:00.000Z]');

    }
    return await userView.aggregate([
        {
            $match: {
                viewDate: {
                    $gte: new Date(start),
                    $lt: new Date(end)
                },

                ProductId: {
                    $eq: productId
                }
            }
        },
        {
            $group: {
                _id: '$userId',
                count: { $sum: 1 }
            },
        },
        {
            $group: {
                _id: 'id',
                dailyUsers: { $sum: 1 },
                // usersWithCount: { $push: "$$ROOT" },
                totalDailyUsers: {
                    $sum: '$count'
                }
            }
        }
    ], function (err, userView) {
        if (err) return next(err);
    });

};

exports.getRecords = async function (req, res, next) {

    if (!req.query.productId) {
        return res.send({ message: "Product id is required" });
    }
    if (!req.query.week && !req.query.month && !req.query.date) {
        var dailyData = await getDailyCount(req, res, next, req.query.productId);
        return  res.send({ dailyData: dailyData });
    }

    if (req.query.month) {
        var monthlyData = await getByMonth(req, res, next, req.query.productId);
        return  res.send({ monthlyData: monthlyData });
    }

    if (req.query.week) {
        var weeklyData = await getWeeklyCount(req, res, next, req.query.productId);
        return  res.send({ weeklyData: weeklyData });
    }

    if (req.query.date) {
        var currentDateData = await getDailyCount(req, res, next, req.query.productId);
        return  res.send({ currentDateData: currentDateData });
    }
}