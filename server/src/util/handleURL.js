import { eds, tmdb } from '../config/endpoints'
import {tmdbAPI} from '../config/credentials'
import queryString from 'query-string'
const fs = require('fs');
const path = require('path');
const fileName = 'train.json';
const dataLocation = path.resolve(__dirname, '..','config', fileName);

export function buildURL(args) {
	//Need to check if it is a refine request
	if (args.refine && args.refine === "y") {
		const action = args.action && args.action.match(/action-/g) ? `&${args.action}` : args.action ? `&action=${args.action}` : ''
		return `${eds}/Search?${args.query}${action}`
	} else {
		//lets build some query params
		return buildParams(args)
	}
}


export function buildTMDBUrl(endpoint, query) {
	return `${tmdb}${endpoint}?api_key=${tmdbAPI}&query=${query}&include_adult=n`
}

function buildParams(args) {
	let query = args.query
	if(args.fieldcode && args.fieldcode !== ''){
		const action = args.action && args.action.match(/action-/g) ? `&${args.action}` : args.action ? `&action=${args.action}` : ''
		const process = decodeURIComponent(args.query)
			.replace(/\:/g, "\:")
			.replace(/\,/g, "\\,")
			.replace(/\(/g, "\(")
			.replace(/\)/g, "\)") 	
		return `${eds}/Search?query=${args.fieldcode}:${process}${action}&autosuggest=y`
	} else {
	const params = {
		query: args.query ? query : '*',
		includefacets: args.includefacets ? args.includefacets : "y",
		pagenumber: args.pagenumber ? args.pagenumber : 1,
		resultsperpage: args.resultsperpage ? args.resultsperpage : 30,
		view: args.view ? args.view : 'detailed',
		expander: args.expander ? args.expander : 'relatedsubjects',
		limiter: args.limiter ? args.limiter : '',
		highlight: args.highliter ? args.highlight : 'n',
		searchmode: args.searchmode ? args.searchmode : 'all',
		autosuggest: 'y',
		autocorrect: args.autocorrect ? args.autocorrect : 'n',
		includeimagequickview: args.includeimagequickview ? args.includeimagequickview : 'n',
		sort: args.sort ? args.sort : 'relevance'
	}
	// console.log(params)
	return `${eds}/Search?${queryString.stringify(params)}`
	}
}

function handleQueryEncoding(query) {
	return remove(query)
}

function remove(query) {
	const clean = query.replace(/\(/g, "\(").replace(/\)/g, "\)").replace(/\:/g, "\:").replace(/\,/g, "\,")
	return clean
}