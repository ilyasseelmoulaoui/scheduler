//this function returns the date given into a iso string format
//we will use it in index.js/resolvers
exports.dateToSting = date => new Date(date).toISOString();