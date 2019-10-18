import { searchHandler } from '../util/search'
import queryString from 'query-string'
import { browzine } from '../config/endpoints'
import { browzineCredentials } from '../config/credentials'

export default {
    Query: {
        doi: async (parent, args, { req }, info) => {
            const search = await searchHandler(`${browzine}libraries/${browzineCredentials.library}/articles/doi/${args.doi}?include=journal&access_token=${browzineCredentials.key}`,
            {
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
            }
           )
           if(search){
               return search
           } else {
               return false
           }
        },
        journalLocator: async (parent, args, { req }, info) => {
            const issn = args.issn.replace(/\-/g, "")
            const search = await searchHandler(`${browzine}libraries/${browzineCredentials.library}/search?access_token=${browzineCredentials.key}&issns=${issn}&include=bookshelves`,
            {
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
            }
           )
           if(search){
               return search
           } else {
               return false
           }
        }    
    }
}
