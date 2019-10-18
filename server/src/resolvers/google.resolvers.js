import { getBody, searchHandler} from '../util/search'
import { googleBooks } from '../config/endpoints'
import { handleGoogleImages } from '../util/process'

export default {
	Query: {
		imagesearch: async (parent, args, {
			req
		}, info) => {
			const search = await getBody(`${googleBooks}?jscmd=viewapi&bibkeys=OCLC:${args.oclc}`, {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			})
			const results = handleGoogleImages(search, args.oclc)
			return results[`OCLC:${args.oclc}`]
		},
		isbnImageSearch: async (parent, args, {
			req
		}, info) => {
			const search = await getBody(`${googleBooks}?jscmd=viewapi&bibkeys=ISBN:${args.isbn}`, {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			})
			const results = handleGoogleImages(search, args.isbn)
			return results[`ISBN:${args.isbn}`]
		}
	}
}