import fetch from 'node-fetch'
const xml2js = require('xml2js');

export async function loginHandler(endpoint, header, parameters, type) {
	try {
		let response = await fetch(endpoint, {
			method: type,
			headers: header,
			body: JSON.stringify(parameters)
		})
		return responseHandling(response)
	} catch (e) {
		console.log(e)
	}
}
export async function searchHandler(endpoint, header) {
	try {
		let response = await fetch(endpoint, {
			method: "GET",
			headers: header
		})
		return responseHandling(response)
	} catch (e) {
		console.log(e)
	}
}
export async function getBody(endpoint) {
	try {
		let response = await fetch(endpoint, {
			method: "GET",
		})
		return await response.text()
	} catch (e) {
		console.log(e)
	}
}
export async function getXML(endpoint) {
	try {
		let response = await fetch(endpoint, {
			method: "GET"
		})
		return await response.text()
	} catch (e) {
		console.log(e)
	}
}
export function buildSearch(args) {
	return {
		query: args.query ? args.query : '*',
		action: args.action ? args.action : ''
	}
}
async function responseHandling(response) {
	console.log(response.status)
	switch (response.status) {
		case 200:
		case 201:
		case 304:
			return await response.json()
			break;
		case 204:
			return {}
		case 400:
			return await catchError('Bad Request', response.statusText)
			break;
		case 401:
		case 403:
			return await catchError('Authentication failed', response.statusText)
			break;
		case 404:
			return await catchError("Doesn't exist", response.statusText)
			break;
		case 405:
			return await catchError('Method not allowed', response.statusText)
			break;
		case 422:
			return await catchError('Data Validation Fail', response.statusText)
			break;
		case 500:
			return await catchError('Internal Server error', response.statusText)
			break;
		default:
			return await catchError('There was an error.  Check your internet connection', '')
			break;
	}
}

function catchError(value, e) {
	const error = {
		name: value,
		message: e
	}
	console.log(error)
	return null
}