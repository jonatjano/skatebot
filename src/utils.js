const Console = require("console");
time = {second: 1000}
time.minute = 60 * time.second
time.hour = 60 * time.minute
time.day = 24 * time.hour
time.week = 7 * time.day

const validateCronInput = input => {
	const inputToArray = (input, limits, words = [], transform = i => i) => {
		const rangeReg = `[${limits[0]}-${limits[1]}]`
		if (! input.match(new RegExp(`^\*|(${rangeReg}(-${rangeReg})?(/\d+)?)$`))) {
			// TODO regex is not valid, must work on it
		}

		if (input.includes(",")) {
			return input.split(",").map(part => inputToArray(part, limits, words, transform)).flat(1)
		}
		let step
		if (input.includes("/")) {
			const splitInput = input.split("/")
		}
	}

/*
O = X(,X)*
X = "*"|(L(-L)?(/D)?)
L = limits[]
D = number

1 = [1] (1)
1-5 = [1,2,3,4,5] (1 to 5)
1-8/2 = [1,3,5,7] (every 2nd between 1 and 8 included)
1/3 = [1,4,7,10] (non standard form of 1-12/3)
1-8/52 = [1] (overflow is lost)
1,3,5 = [1,3,5] (comma makes an union of before and after)
*/

	if (typeof input === "string") {
		const splitInput = input.split(" ")
		input = {
			minute: splitInput[0],
			hour: splitInput[1],
			day: splitInput[2],
			month: splitInput[3],
			dayOfWeek: splitInput[4]
		}
	}
	if (typeof input !== "object") {
		throw new TypeError("Input type is not valid")
	}
	if (input.minute === undefined || input.hour === undefined || input.day === undefined || input.month === undefined || input.dayOfWeek === undefined) {
		throw new Error("Given input doesn't have the necessary fields")
	}
	// input.minute = inputToArray(input.minute, [0,59])
	// input.hour = inputToArray(input.hour, [0,23])
	// input.day = inputToArray(input.day, [1,31])
	// input.month = inputToArray(input.month, [1,12], ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"])
	// input.dayOfWeek = inputToArray(input.dayOfWeek, [0,6], ["SUN","MON","TUE","WED","THU","FRI","SAT"], i => i === 7 ? 0 : Number.NaN)

	console.log(inputToArray("1,3,7,15,20,18", [0,59]))

	return input
}

module.exports = {
	time,

	/**
	 * @param { { minute: string, hour: string, day: string, month: string, dayOfWeek: string} | string } input
	 * @return {Date}
	 */
	nextCronDate(input = "* * * * *") {
		// these are not standard, but easy to implement
		switch (input) {
			case "@reboot":   return new Date()
			case "@yearly":   input = "0 0 1 1 *"; break
			case "@annually": input = "0 0 1 1 *"; break
			case "@monthly":  input = "0 0 1 * *"; break
			case "@weekly":   input = "0 0 * * 0"; break
			case "@daily":    input = "0 0 * * *"; break
			case "@hourly":   input = "0 * * * *"; break
		}

		input = validateCronInput(input)

		const date = new Date()
		date.setUTCMinutes(date.getUTCMinutes() + 1, 0, 0)

		if (input.minute === undefined || input.hour === undefined || input.day === undefined || input.month === undefined || input.dayOfWeek === undefined) {
			throw new Error("Given input is invalid")
		}

		const cronInput = {}

		if (input.minute === "*") {
			cronInput.minute = Array(60).fill().map((_,i) => i)
		} else {
			cronInput.minute = input.minute.split(",").map(v => Number(v))
		}
		if (input.hour === "*") {
			cronInput.hour = Array(24).fill().map((_,i) => i)
		} else {
			cronInput.hour = input.hour.split(",").map(v => Number(v))
		}
		if (input.day === "*") {
			cronInput.day = Array(31).fill().map((_,i) => i + 1)
		} else {
			cronInput.day = input.day.split(",").map(v => Number(v))
		}
		if (input.month === "*") {
			cronInput.month = Array(12).fill().map((_,i) => i + 1)
		} else {
			cronInput.month = input.month.split(",").map(v => Number(v))
		}
		if (input.dayOfWeek === "*") {
			cronInput.dayOfWeek = Array(7).fill().map((_,i) => i)
		} else {
			cronInput.dayOfWeek = input.dayOfWeek.split(",").map(v => Number(v))
		}

		if (
			cronInput.minute.every(Number.isNaN) ||
			cronInput.hour.every(Number.isNaN) ||
			cronInput.day.every(Number.isNaN) ||
			cronInput.month.every(Number.isNaN) ||
			cronInput.dayOfWeek.every(Number.isNaN)
		) {
			throw new Error("Given input is invalid")
		}

		let dateIsNotValid = true
		const maxDate = new Date(Date.now())
		maxDate.setUTCFullYear(maxDate.getUTCFullYear() + 29, 0, 0)
		while (dateIsNotValid && date.valueOf() < maxDate.valueOf()) {

			dateIsNotValid = false
			while (! cronInput.month.includes(date.getUTCMonth() + 1)) {
				date.setUTCDate(1)
				date.setUTCMonth(date.getUTCMonth() + 1)
				date.setUTCHours(0, 0)
				dateIsNotValid = true
			}

			while (
				! cronInput.day.includes(date.getUTCDate()) &&
				! cronInput.dayOfWeek.includes(date.getUTCDay()) &&
				cronInput.month.includes(date.getUTCMonth() + 1)
				) {
				date.setUTCDate(date.getUTCDate() + 1)
				date.setUTCHours(0, 0)
				dateIsNotValid = true
			}

			while (! cronInput.hour.includes(date.getUTCHours()) &&
				cronInput.day.includes(date.getUTCDate()) &&
				cronInput.dayOfWeek.includes(date.getUTCDay()) &&
				cronInput.month.includes(date.getUTCMonth() + 1)
				) {
				date.setUTCHours(date.getUTCHours() + 1, 0)
				dateIsNotValid = true
			}

			while (! cronInput.minute.includes(date.getUTCMinutes()) &&
				cronInput.hour.includes(date.getUTCHours()) &&
				cronInput.day.includes(date.getUTCDate()) &&
				cronInput.dayOfWeek.includes(date.getUTCDay()) &&
				cronInput.month.includes(date.getUTCMonth() + 1)
				) {
				console.log(date.toUTCString())
				date.setUTCMinutes(date.getUTCMinutes() + 1)
				dateIsNotValid = true
			}
		}
		if (dateIsNotValid) {
			throw new RangeError("No valid date in the next 28 years")
		}

		return date
	},

	/**
	 * @param {Date} date
	 * @param {string} [dateType]
	 * @return {string}
	 */
	dateAsDiscordTag(date, dateType= "F") {
		return `<t:${Math.floor(date.getTime()/1000)}:${dateType}>`
	}
}
