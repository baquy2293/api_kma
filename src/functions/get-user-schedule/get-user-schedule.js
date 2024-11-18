// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const CMC = require("cmcsoft-iu")({ HOST_API: "http://qldt.actvn.edu.vn" })

const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, POST'
};

exports.handler = async (event, context) => {

	if (event.httpMethod != "POST") return { statusCode: 200, body: JSON.stringify({ code: "ERROR", message: "Invalid Method" }) }

	try {
		// const username = event.queryStringParameters.username || ''
		// const password = event.queryStringParameters.password || ''

		const rqBody = JSON.parse(event.body)

		try {

			const api = await CMC({ user: rqBody.username, pass: rqBody.password })
			const dpr = await api.studentTimeTable.showTimeTable()

			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({ code: "SUCCESS", data: dpr })
			}

		} catch (err) {
			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({ code: "ERROR", message: err })
			}
		}

	} catch (err) {
		return { statusCode: 500, headers, body: err.toString() }
	}
}
