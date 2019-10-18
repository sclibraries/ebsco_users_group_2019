import { searchHandler, loginHandler , getBody} from '../util/search'
import {buildTMDBUrl} from '../util/handleURL'


export default {
    Query: {
        tmdbSearch: async (parent, args, { req }, info) => {  
            const search = await searchHandler(buildTMDBUrl('/search/multi',
             		encodeURIComponent(args.query.replace(/\:.*/,'')
                                .replace(/\[(.*?)\](.*?)/g, "")
                                .replace(/(.*?)=/g,"")
                                .trim())
             ),
            {
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
            }
           ) 
       let results = search
       if(Array.isArray(search.results)){
          search.results.map(items => {
	        if(items && items["title"]){
            	if(args.query.toLowerCase().search(items["title"].toLowerCase()) > -1){    
					if(items["release_date"].search(args.year) > -1){
						if(items.poster_path !== null){
							results = {results: [items]}
                		}
                	}	    
            	}
            }
          })
        }     
        return results  
        }    
    },
    TMDBResults: {
	    fullrecord: async(parent, args, { req }, info ) => {
		     const search = await searchHandler(buildTMDBUrl(`/${parent.media_type}/${parent.id}`),
            {
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
            }
           )
		   return search  
	    },
	    fullrecordcast : async(parent, args, { req }, info ) => {
		     const search = await searchHandler(buildTMDBUrl(`/${parent.media_type}/${parent.id}/credits`),
            {
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
            }
           )
		return search  
    	}
    }	
}