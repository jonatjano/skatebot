const utils = require("./src/utils.js")

// console.log("\n",
//     utils.nextCronDate("* * * * *"),
// 	utils.nextCronDate("1 * * * *"),
// 	utils.nextCronDate("* 1 * * *"),
// 	utils.nextCronDate("* * 1 * *"),
// 	utils.nextCronDate("* * * 1 *"),
// 	utils.nextCronDate("* * * * 1"),
// 	utils.nextCronDate("1 1 1 1 1"), "\n",
// 	(d=>{d.setUTCMinutes(d.getUTCMinutes() + 1, 0, 0);return d})(new Date()),
// 	(d=>{d.setUTCHours(d.getUTCHours() + 1, 1, 0, 0);return d})(new Date()),
// 	(d=>{d.setUTCDate(d.getUTCDate() + 1);d.setUTCHours(1, 0, 0, 0);return d})(new Date()),
// 	(d=>{d.setUTCMinutes(d.getUTCMinutes() + 1, 0, 0);return d})(new Date()),
// 	(d=>{d.setUTCFullYear(d.getUTCFullYear() + 1, 0 ,1);d.setUTCHours(0, 0, 0, 0);return d})(new Date()),
// 	(d=>{d.setUTCDate(13);d.setUTCHours(0, 0, 0, 0);return d})(new Date()),
// 	(d=>{d.setUTCFullYear(2022, 0, 1);d.setUTCHours(1, 1, 0, 0);return d})(new Date())
// )
//
// console.log("\n",
// 	utils.nextCronDate("1 1 1 1 1"), "\n",
// 	(d=>{d.setUTCFullYear(2022, 0, 1);d.setUTCHours(1, 1, 0, 0);return d})(new Date())
// )

console.log(utils.nextCronDate("0 0 * * 2"))

// console.log(utils.nextCronDate("* * 1 12 1"))
// console.log(utils.nextCronDate("61 * * * *"))

