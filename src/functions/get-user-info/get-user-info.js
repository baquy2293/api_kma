// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const CMC = require("cmcsoft-iu")({ HOST_API: "http://qldt.actvn.edu.vn" })

const HEAD = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
	"Access-Control-Allow-Credentials": true,
	"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
}

exports.handler = async (event, context) => {

	if (event.httpMethod == "OPTIONS") {
		return {
			statusCode: 200,
			headers: HEAD,
			body: 'This was a preflight call!'
		}
	}

	if (event.httpMethod != "POST") return { statusCode: 500, body: JSON.stringify({ code: "ERROR PROTOCAL", message: "Invalid Method" }) }

	try {
		//const rqBody = event.queryStringParameters
		const rqBody = JSON.parse(event.body)

		try {

			const api = await CMC({ user: rqBody.username, pass: rqBody.password })
			const studentInfo = await api.studentProfile.show()
			const schedule = await api.studentTimeTable.showTimeTable()

			let data = {
				studentInfo: studentInfo,
				schedule: schedule
			}

			return {
				statusCode: 200,
				headers: HEAD,
				body: JSON.stringify({ code: "SUCCESS", data: data })
			}


		} catch (err) {
			console.log("INSIDE CATCH ERROR: ");

			return {
				statusCode: 200,
				headers: HEAD,
				body: JSON.stringify({ code: "ERROR", type: "IN", message: err })
			}
		}

	} catch (err) {
		console.log("OUTSIDE CATCH ERROR: ")

		return {
			statusCode: 500,
			headers: HEAD,
			body: JSON.stringify({ code: "ERROR", type: "OUT", message: err })
		}

	}
}
