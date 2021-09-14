time = {millisecond: 1, second: 1000}
time.minute = 60 * time.second
time.hour = 60 * time.minute
time.day = 24 * time.hour
time.week = 7 * time.day

/**
 * @param input {{dayOfWeek: string, hour: string, month: string, day: string, minute: string} | string}
 * @return {{dayOfWeek: number[], hour: number[], month: number[], day: number[], minute: number[]}}
 */
const validateCronInput = input => {
	/**
	 * @param {string} input
	 * @param {[number, number]} limits
	 * @param {string[]} [words]
	 * @param {Map<String|number, number>} [transform]
	 * @return {number[]}
	 */
	const inputToArray = (input, limits, words = [], transform = new Map()) => {
		if (words.includes(input)) {
			input = (words.indexOf(input) + limits[0]).toString()
		} else if (transform.has(input)) {
			input = transform.get(input).toString()
		} else if (transform.has(Number(input))) {
			input = transform.get(Number(input)).toString()
		}

		if (! input.includes(",") &&
			! input.match(/\*(\/\d+)?|(\d+(-\d+)?(\/\d+)?)/)
		) {
			throw new TypeError(`Invalid input`)
		}

		if (input.includes(",")) {
			return [...new Set(input.split(",").map(part => inputToArray(part, limits, words, transform)).flat(1))]
		}
		let min, max
		if (input.includes("-")) {
			[min, max] = input.split("/")[0].split("-").map(Number)
			if (min > max) {
				throw new RangeError("range min is bigger than max")
			}
		} else if (input.startsWith("*")) {
			min = limits[0]
			max = limits[1]
		} else {
			min = Number(input.split("/")[0])
		}
		if (min < limits[0] || min > limits[1] || max > limits[1]) {
			throw new TypeError(`Invalid input`)
		}
		const ret = []
		if (input.includes("/")) {
			let step = Number(input.split("/")[1])
			max = max ?? limits[1]
			for (let i = min; i <= max; i += step) {
				ret.push(i)
			}
		} else {
			max = max ?? min
			for (let i = min; i <= max; i ++) {
				ret.push(i)
			}
		}
		return ret
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
	return {
		minute: inputToArray(input.minute, [0, 59]),
		hour: inputToArray(input.hour, [0, 23]),
		day: inputToArray(input.day, [1, 31]),
		month: inputToArray(input.month, [1, 12], ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]),
		dayOfWeek: inputToArray(input.dayOfWeek, [0, 6], ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"], new Map([[7, 0]]))
	}
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

		const cronInput = validateCronInput(input)

		const date = new Date()
		date.setUTCMinutes(date.getUTCMinutes() + 1, 0, 0)

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

			while (! cronInput.hour.includes(date.getUTCHours()) && (
				cronInput.day.includes(date.getUTCDate()) ||
				cronInput.dayOfWeek.includes(date.getUTCDay()) ) &&
				cronInput.month.includes(date.getUTCMonth() + 1)
				) {
				date.setUTCHours(date.getUTCHours() + 1, 0)
				dateIsNotValid = true
			}

			while (! cronInput.minute.includes(date.getUTCMinutes()) &&
				cronInput.hour.includes(date.getUTCHours()) && (
				cronInput.day.includes(date.getUTCDate()) ||
				cronInput.dayOfWeek.includes(date.getUTCDay()) ) &&
				cronInput.month.includes(date.getUTCMonth() + 1)
				) {
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
	},

	/**
	 * @param {int} duration
	 */
	toTimeString(duration) {
		let ret = ""
		let week = Math.floor(duration / time.week)
		duration -= week * time.week
		let day = Math.floor(duration / time.day)
		duration -= day * time.day
		let hour = Math.floor(duration / time.hour)
		duration -= hour * time.hour
		let minute = Math.floor(duration / time.minute)
		duration -= minute * time.minute
		let second = Math.floor(duration / time.second)
		duration -= second * time.second
		let millisecond = Math.floor(duration / time.millisecond)
		duration -= millisecond * time.millisecond
		return `${week ? week + "wk " : ""}${day ? day + "d " : ""}${hour ? hour + "h " : ""}${minute ? minute + "min " : ""}${second ? second + "s " : ""}${millisecond ? millisecond + "ms" : ""}`
	}
}
