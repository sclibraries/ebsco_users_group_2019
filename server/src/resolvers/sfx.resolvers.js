import { getXML } from '../util/search'
import { sfx } from '../config/endpoints'
import { processSFX } from '../util/process'
import queryString from 'query-string'
import { removeAllListeners } from 'cluster';
const parser = require('xml2js').parseString;

export default {
    Query: {
        sfx: async (parent, args, { req }, info) => {
            const params = {
                genre: args.genre ? args.genre : '',
                isbn: args.isbn ? args.isbn: '',
                issn: args.issn ? args.issn : '',
                title: args.title ? args.title : '',
                volume: args.volume ? args.volume : '',
                issue: args.issue ? args.issue : '',
                atitle: args.atitle ? args.atitle : '',
                aulast: args.aulast,
                spage: args.spage ? args.spage : ''
            }
            let data = []
            const search = await getXML(`${sfx}&${queryString.stringify(params)}`)
            parser(search, function (err, result) {
                if(result.ctx_obj_set && result.ctx_obj_set.ctx_obj[0] && result.ctx_obj_set.ctx_obj[0].ctx_obj_targets[0]){
                    data = processSFX(result.ctx_obj_set.ctx_obj[0].ctx_obj_targets[0].target)
                } else {
                    data = false
                }
            });
            return data
        }    
    }
}        