const utils = require("./src/utils.js")

console.log(
    utils.nextCronDate("* * * * *"),
    utils.nextCronDate("1 * * * *"),
    utils.nextCronDate("* 1 * * *"),
    utils.nextCronDate("* * 1 * *"),
    utils.nextCronDate("* * * 1 *"),
    utils.nextCronDate("* * * * 1"),
    utils.nextCronDate("1 1 1 1 1")
)

console.log(utils.nextCronDate("* * 1 12 1"))
// console.log(utils.nextCronDate("61 * * * *"))

