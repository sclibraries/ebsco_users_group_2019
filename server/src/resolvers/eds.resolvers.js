import { searchHandler, loginHandler , getBody, getXML} from '../util/search'
import { login } from '../datasource/uidAuth'
import { processRecords, processRetrieve, handleGoogleImages, processEmpty } from '../util/process'
import queryString from 'query-string'
import { buildURL, buildTMDBUrl }  from '../util/handleURL'
import { eds, edsauth, archivespace, googleBooks, browzine, sfx } from '../config/endpoints'
import { browzineCredentials } from '../config/credentials'
import { processSFX } from '../util/process'
const parser = require('xml2js').parseString;

export default {
	Query: {
		search: async (parent, args, {
			req
		}, info) => {
			const authentication = await login(parent, args, {
				req
			}, info)
			if (authentication.SessionToken && authentication.AuthToken) {
				const search = await searchHandler(buildURL(args), {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'charset': 'utf-8',
					'x-authenticationToken': authentication.AuthToken,
					'x-sessionToken': authentication.SessionToken
				})
	
				if (search && search.SearchResult && search.SearchResult.Statistics.TotalHits > 0) {
					return processRecords(search)
				} else if (search && search.SearchResult) {
					return processEmpty(search)
				} else {
					return null
				}
			}
		},
		info: async (parent, args, {
			req
		}, info) => {
			const authentication = await login(parent, args, {
				req
			}, info)
			if (authentication.SessionToken && authentication.AuthToken) {
				const search = await searchHandler(`${eds}/Info`, {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-authenticationToken': req.session.authorizeToken,
					'x-sessionToken': req.session.sessionToken
				})
				return search
			}
		},
		record: async (parent, args, {
			req
		}, info) => {
			const authentication = await login(parent, args, {
				req
			}, info)
			if (authentication.SessionToken && authentication.AuthToken) {
				const search = await searchHandler(`${eds}/Retrieve?an=${args.an}&dbid=${args.dbid}`, {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-authenticationToken': req.session.authorizeToken,
					'x-sessionToken': req.session.sessionToken
				})
				return processRetrieve(search)
			}
		},
		citation: async (parent, args, {
			req
		}, info) => {
			const authentication = await login(parent, args, {
				req
			}, info)
			if (authentication.SessionToken && authentication.AuthToken) {
				const search = await searchHandler(`${eds}/CitationStyles?an=${args.an}&dbid=${args.dbid}&styles=${args.styles}`, {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-authenticationToken': req.session.authorizeToken,
					'x-sessionToken': req.session.sessionToken
				})
				if (search) {
					return search
				} else {
					return null
				}
			}
		},
		autocomplete: async (parent, args, {
			req
		}, info) => {
			const authentication = await login(parent, args, {
				req
			}, info)
			if (authentication.AutoCompleteToken && authentication.AutoCompleteURL) {
				const params = {
					term: args.query,
					idx: "rawqueries",
					token: authentication.AutoCompleteToken,
				}
				const search = await searchHandler(`${authentication.AutoCompleteURL}?${queryString.stringify(params)}&filters=%5B%7B"name"%3A"custid"%2C"values"%3A%5B"s8897501"%5D%7D%5D`, {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				})
				if (search) {
					return search
				} else {
					return null
				}
			}
		}
	},
	Records: {
		retrieve: async (parent, args, {
			req
		}, info) => {
			const response = {
				an: parent.an,
				dbid: parent.dbid
			}
			const search = await searchHandler(`${eds}/Retrieve?${queryString.stringify(response)}`, {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-authenticationToken': req.session.authorizeToken,
				'x-sessionToken': req.session.sessionToken
			})
			if (search && search.Record) {
				return processRetrieve(search, req.session.guest ? req.session.guest : 'y')
			} else {
				return null
			}
		},
		doi: async (parent, args, {
			req
		}, info) => {
			let doiValue = false
			if (parent.identifiers) {
				doiValue = Object.keys(parent.identifiers).map(key => {
					if (parent.identifiers[key].Type === 'doi') {
						return parent.identifiers[key].Value
					} else {
						return false
					}
				})
			}
			if (doiValue !== false) {
				const search = await searchHandler(`${browzine}libraries/${browzineCredentials.library}/articles/doi/${doiValue}?access_token=${browzineCredentials.key}`, {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				})
				if (search && search.data) {
					return search.data
				} else {
					return false
				}
			} else {
				return false
			}
		},
		googleImages: async (parent, args, {
			req
		}, info) => {
			const isbn = parent.isbn && parent.isbn[0] ? parent.isbn[0] : parent.isbn
			if ((!parent.image || parent.image === null) && parent.pubTypeId === "book") {
				const search = await getBody(`${googleBooks}?jscmd=viewapi&bibkeys=ISBN:${isbn}`, {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				})
				const results = handleGoogleImages(search)
				return results[`ISBN:${isbn}`]
			}
		},
		sfx: async (parent, args, {
			req
		}, info) => {
			const params = {
				genre: parent.pubType ? parent.pubType : '',
				isbn: parent.isbn ? parent.isbn[0] : '',
				issn: parent.issnItem ? parent.issnItem[0] : '',
				title: parent.titleFullRelationship ? parent.titleFullRelationship[0] : '',
				volume: parent.volume ? parent.volume[0] : '',
				issue: parent.issue ? parent.issue[0] : '',
				atitle: parent.titleFull ? parent.titleFull[0] : '',
				aulast: parent.authorItem,
				spage: parent.startPage ? parent.startPage[0] : ''
			}
			let data = []
			const search = await getXML(`${sfx}&${queryString.stringify(params)}`)
			if (search) {
				parser(search, function(err, result) {
					if (result.ctx_obj_set && result.ctx_obj_set.ctx_obj[0] && result.ctx_obj_set.ctx_obj[0].ctx_obj_targets[0]) {
						data = processSFX(result.ctx_obj_set.ctx_obj[0].ctx_obj_targets[0].target)
					} else {
						data = false
					}
				});
				if (data !== false) {
					return data
				} else {
					return null
				}
			} else {
				return null
			}
		},
		tmdbSearch: async (parent, args, {
			req
		}, info) => {
			if ((!parent.image || parent.image === null) && parent.pubTypeId === "videoRecording") {
				const search = await searchHandler(buildTMDBUrl('/search/multi', encodeURIComponent(parent.titles[0].TitleFull.replace(/\:.*/, '').replace(/\[(.*?)\](.*?)/g, "").replace(/(.*?)=/g, "").trim())), {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				})
				let results = search
				if (search && search.results && Array.isArray(search.results)) {
					search.results.map(items => {
						if (items && items["title"] && items["release_date"]) {
							if (parent.titles[0].TitleFull.toLowerCase().search(items["title"].toLowerCase()) > -1) {
								if (parent && parent.year && parent.year[0]) {
									if (parent.year[0].search(items["release_date"]) > -1) {
										if (items.poster_path !== null) {
											results = {
												results: [items]
											}
										}
									}
								}
							}
						}
					})
				}
				return results
			}
		}
	}
}