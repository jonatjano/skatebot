time = {second: 1000}
time.minute = 60 * time.second
time.hour = 60 * time.minute
time.day = 24 * time.hour
time.week = 7 * time.day

module.exports = {
	time,

	/**
	 * @param { { minute: string, hour: string, day: string, month: string, dayOfWeek: string} | string } input
	 * @return {Date}
	 */
	nextCronDate(input = "* * * * *") {

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

		const date = new Date(Date.now())
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
			console.log(date.toUTCString())
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
