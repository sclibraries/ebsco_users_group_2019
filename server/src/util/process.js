import decode from 'decode-html'
import queryString from 'query-string'
import { DESTRUCTION } from 'dns';
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const fs = require('fs');
const path = require('path');

export const processRecords = ( item ) => {
    /* 
        Defining Object literals from API results.
    */
    const { SearchRequestGet, SearchResult } = item || { } 
    const { QueryString, SearchCriteriaWithActions } = SearchRequestGet || { } 
    const { QueriesWithAction, FacetFiltersWithAction, LimitersWithAction, ExpandersWithAction, PublicationWithAction } = SearchCriteriaWithActions || { }
    const { AutoSuggestedTerms, Statistics, Data, AvailableFacets, AutoCorrectedTerms } = SearchResult || { }
    const { TotalHits, TotalSearchTime, Databases } = Statistics || { }
    const { RecordFormat } = Data || { }
    /* 
        Returning reformated results from API.  This breaks down the multidemensional array to
        something easier to manage in the front end
    */
    return {
        queryString: QueryString ,
        queryWithAction: QueriesWithAction,
        facetFiltersWithAction: FacetFiltersWithAction,
        limtersWithAction: LimitersWithAction,
        expandersWithAction: ExpandersWithAction,
        publicationWithAction: PublicationWithAction,
        autoSuggestedTerms: AutoSuggestedTerms,
        statistics: {
            hits: TotalHits,
            time: TotalSearchTime
        },
        databases: Databases,
        recordFormat: RecordFormat,
        records: Records(Data) || false,
        facets: handleFacets(AvailableFacets)  || false,
    }
}


/* 
    TODO: I dont think we need this anymore
*/
export function processEmpty(search){
    const { SearchRequestGet, SearchResult } = search
    const { QueryString, SearchCriteriaWithActions } = SearchRequestGet || { } 
    const { QueriesWithAction, FacetFiltersWithAction, LimitersWithAction, ExpandersWithAction, PublicationWithAction } = SearchCriteriaWithActions || { }
    const { AutoSuggestedTerms, Statistics, Data, AvailableFacets } = SearchResult || { }
    const { TotalHits, TotalSearchTime, Databases } = Statistics || { }
    const { RecordFormat } = Data || { }
    return{
        queryString: QueryString ,
        queryWithAction: QueriesWithAction,
        facetFiltersWithAction: FacetFiltersWithAction,
        limtersWithAction: LimitersWithAction,
        expandersWithAction: ExpandersWithAction,
        publicationWithAction: PublicationWithAction,
        autoSuggestedTerms: AutoSuggestedTerms,
        statistics: {
            hits: TotalHits,
            time: TotalSearchTime
        },
        databases: Databases,
        recordFormat: RecordFormat,
        records: null,
        facets: null
    }
}


export const processRetrieve = (search, guest) => {
    const { Record } = search
    return {
        records: Retrieve(Record, guest)
    }    
}


export const processCopiesAvailable = (dueData) => {
    if(dueData[0] === "Available"){
        return dueData.length
    }
}

export const  Retrieve = (records, guest) => {
    // console.log(records)
    const { 
        ResultId, 
        Header, 
        PLink, 
        ImageInfo, 
        CustomLinks, 
        FullText, 
        Items, 
        RecordInfo, 
        Holdings, 
        ImageQuickViewItems,
        IllustrationInfo
    } = records

const { DbId, DbLabel, An, RelevancyScore, AccessLevel, PubType, PubTypeId } = Header 
const { BibRecord, AccessInfo, FileInfo, personRecord, RightsInfo } = RecordInfo
const { BibRelationships, BibEntity } = BibRecord
const { IsPartOfRelationships, HasContributorRelationships, HasPubAgentRelationships, HasPartRelationships } = BibRelationships
const { 
        Classification, 
        Dates, 
        Identifiers, 
        Languages, 
        Numbering, 
        PhysicalDescription, 
        Subjects, 
        Titles, 
        Type, 
        ItemTypes,
        ContentDescription,
        Id
    } = BibEntity
    return {
        id: ResultId,
        dbid: DbId,
        dbLabel: DbLabel,
        an: An,
        relevancyScore: RelevancyScore,
        accessLevel: AccessLevel,
        pubType: PubType,
        pubTypeId: PubTypeId,
        pLink: PLink,
        image: ImageInfo,
        imageItem: handleImages(ImageInfo, An),
        customLinks: CustomLinks,
        pdf:  processPDF(FullText, guest),
        otherFullText: processOtherFullText(FullText),
        customLinkAvailable: processCustomLink(FullText),
        fullText: FullText,
        titleItem: processIndividualItems(Items, "Title"),
        titleSourceItem: processIndividualItems(Items, "TitleSource"),
        datePublicationItem: processIndividualItems(Items, "DatePub"),
        pubTypeItem: processIndividualItems(Items, "TypePub"),
        subjectItem: processIndividualSubjects(Items, "Subject"),
        subjectPersonItem: processIndividualItems(Items, "SubjectPerson"),
        abstractItem: processIndividualOther(Items, "Abstract"),
        authorItem: processIndividualAuthors(Items, "Author"),
        urlItem: processIndividualItems(Items, "URL"),
        noteTitleSourceItem: processIndividualItems(Items, 'NoteTitleSource'),
        formatItem: processIndividualItems(Items, "Format"),
        subjectProductItem: processIndividualItems(Items, "SubjectProduct"),
        issnItem: processIndividualItems(Items, "ISSN"),
        abstractSuppliedCopyrightItem: processIndividualItems(Items, "AbstractSuppliedCopyright"),
        oclcItem: processIndividualItemsLabel(Items, "OCLC"),
        doiItem: processDOIRecords(Items, "DOI"),
        isbn: processBibEntity(IsPartOfRelationships, "isbn-print", "Identifiers", "Type"),
        items: ItemList(Items),
        accessInformation: AccessInfo,
        classification: Classification,
        dates: Dates,
        identifiers: Identifiers,
        language: Languages,
        numbering: Numbering,
        physicalDescription: PhysicalDescription,
        subjects: Subjects,
        titles: Titles,
        type: Type,
        itemTypes: ItemTypes,
        contentDescription: ContentDescription,
        bibEntityId: Id,
        volume: processBibEntity(IsPartOfRelationships, "volume", "Numbering", "Type"),
        issue: processBibEntity(IsPartOfRelationships, "issue", "Numbering", "Type"),
        isbn: processBibEntity(IsPartOfRelationships, "isbn-print", "Identifiers", "Type"),
        year: processisPart(IsPartOfRelationships, "Dates", "Y"),
        month: processisPart(IsPartOfRelationships, "Dates", "M"),
        day: processisPart(IsPartOfRelationships, "Dates", "D"),
        hasContributorRelationship: HasContributorRelationships,
        pubAgentRelationship: HasPubAgentRelationships,
        isPartOfRelationship: IsPartOfRelationships,
        hasPartRelationship:  HasPartRelationships,
        fileInfo: FileInfo,
        personRecord: personRecord,
        rightsInfo: RightsInfo,
        holdings: Holdings,
        imageQuickViewItems: ImageQuickViewItems,
        illustrationInfo: IllustrationInfo
    }
}

/* 
   Data returned from a basic query
*/
const Records = (data) => {
    const { Records } = data
    return Records ? Object.keys(Records).map(items => {
        /* 
            Defining Object literals from mapped Record data
        */
        const { 
                ResultId, 
                Header, 
                PLink, 
                ImageInfo, 
                CustomLinks, 
                FullText, 
                Items, 
                RecordInfo, 
                Holdings, 
                ImageQuickViewItems,
                IllustrationInfo
            } = Records[items]

        const { DbId, DbLabel, An, RelevancyScore, AccessLevel, PubType, PubTypeId } = Header || {}
        const { BibRecord, AccessInfo, FileInfo, personRecord, RightsInfo } = RecordInfo || {}

        const { BibRelationships, BibEntity } = BibRecord
        const { IsPartOfRelationships, HasContributorRelationships, HasPubAgentRelationships, HasPartRelationships } = BibRelationships
        let { 
                Classification, 
                Dates, 
                Identifiers, 
                Languages, 
                Numbering, 
                PhysicalDescription, 
                Subjects, 
                Titles, 
                Type, 
                ItemTypes,
                ContentDescription,
                Id
            } = BibEntity || { }
        
        /* 
            Returning new mapped data points for the front end
        */    
        return {
            id: ResultId,
            dbid: DbId,
            dbLabel: DbLabel,
            an: An,
            relevancyScore: RelevancyScore,
            accessLevel: AccessLevel,
            pubType: PubType,
            pubTypeId: PubTypeId,
            pLink: PLink,
            image: ImageInfo,
            imageItem: handleImages(ImageInfo, An),
            customLinks: CustomLinks,
            pdf:  processPDF(FullText),
            otherFullText: processOtherFullText(FullText),
            customLinkAvailable: processCustomLink(FullText),
            fullText: FullText,
            titleItem: processIndividualItems(Items, "Title"),
            titleSourceItem: processIndividualItems(Items, "TitleSource"),
            datePublicationItem: processIndividualItems(Items, "DatePub"),
            pubTypeItem: processIndividualItems(Items, "TypePub"),
            subjectItem: processIndividualSubjects(Items, "Subject"),
            subjectPersonItem: processIndividualItems(Items, "SubjectPerson"),
            abstractItem: processIndividualOther(Items, "Abstract"),
            authorItem: processIndividualAuthors(Items, "Author"),
            urlItem: processIndividualItems(Items, "URL"),
            noteTitleSourceItem: processIndividualItems(Items, 'NoteTitleSource'),
            formatItem: processIndividualItems(Items, "Format"),
            subjectProductItem: processIndividualItems(Items, "SubjectProduct"),
            abstractSuppliedCopyrightItem: processIndividualItems(Items, "AbstractSuppliedCopyright"),
            oclcItem: processIndividualItemsLabel(Items, "OCLC"),
            issnItem: processIndividualItems(Items, "ISSN"),
            isbn: processBibEntity(IsPartOfRelationships, "isbn-print", "Identifiers", "Type"),
            items: ItemList(Items),
            accessInformation: AccessInfo,
            classification: Classification !== 'undefined' ? Classification : '',
            dates: Dates !== 'undefined' ? Dates : '',
            identifiers: Identifiers !== 'undefined'  ? Identifiers : '',
            language: Languages !== 'undefined'  ? Languages : '',
            numbering: Numbering !== 'undefined'  ? Numbering : '',
            physicalDescription: PhysicalDescription !== 'undefined'  ? PhysicalDescription : '',
            subjects: Subjects !== 'undefined'  ? Subjects : '',
            titles: Titles !== 'undefined'  ? Titles : '',
            type: Type !== 'undefined'  ? Type : '',
            itemTypes: ItemTypes !== 'undefined'  ? ItemTypes : '',
            contentDescription: ContentDescription !== 'undefined'  ? ContentDescription : '',
            bibEntityId: Id !== 'undefined'  ? Id : '',
            volume: processBibEntity(IsPartOfRelationships, "volume", "Numbering", "Type"),
            issue: processBibEntity(IsPartOfRelationships, "issue", "Numbering", "Type"),
            isbn: processBibEntity(IsPartOfRelationships, "isbn-print", "Identifiers", "Type"),
            year: processisPart(IsPartOfRelationships, "Dates", "Y"),
            month: processisPart(IsPartOfRelationships, "Dates", "M"),
            day: processisPart(IsPartOfRelationships, "Dates", "D"),
            hasContributorRelationship: HasContributorRelationships,
            pubAgentRelationship: HasPubAgentRelationships,
            isPartOfRelationship: IsPartOfRelationships,
            hasPartRelationship:  HasPartRelationships,
            fileInfo: FileInfo,
            personRecord: personRecord,
            rightsInfo: RightsInfo,
            holdings: Holdings,
            imageQuickViewItems: ImageQuickViewItems,
            illustrationInfo: IllustrationInfo
        }
    }) : false
}

export function processSFX(records){
    return Object.keys(records).map(items => {
        return {
            name: records[items].target_name && records[items].target_name[0] ? records[items].target_name[0] : '' ,
            public_name: records[items].target_public_name && records[items].target_public_name[0] ? records[items].target_public_name[0] : '',
            url:  records[items].target_url && records[items].target_url[0] ? records[items].target_url[0] : ''
        }
    })
}

function handleImages(image, an){
	let images = ''
	if(loadFromFile(an.replace('fivecol.', '')) !== null){
		const foundImage = loadFromFile(an.replace('fivecol.', ''))
		images = "data:image/jpeg;base64," + foundImage
	} else if(Array.isArray(image)){
		image.map(items => {
			if(items.Size === "medium"){
				images = items.Target
			}
		})
	} else {
		images = ''
	}
	return images
}

const ItemList = (results) => {
    if(results){
    return Object.keys(results).map(items => {
        return {
            name: results[items].Name,
            label: results[items].Label,
            group: results[items].Group,
            data: explodeBreaks(cleanData(decode(results[items].Data)), "<br />")
        }
    })
    } else {
        return ''
    } 
}

function processDOI(item){
    if(item){
    return Object.keys(item).map(key => {
        if(item[key].Type === 'doi' || 'DOI'){
          return item[key].Value.replace('http://dx.doi.org/', '')
        }
    }) 
    }    
}

function processRecordInfo(results, type, key){
    let data = []
    if(results){
    Object.keys(results).map(item => {
        const bibIdentity = results[item][type]
        if(bibIdentity && bibIdentity !== null && bibIdentity !== undefined){
            return Object.keys(bibIdentity).map(keys => {
                if(bibIdentity[keys][key]){
                    data.push(bibIdentity[keys][key])
                }    
            })
        }    
    })
    }
    return data
}

function processBibEntity(results, type, identifier, key){
    let data = []
    if(results){
    Object.keys(results).map(item => {
        const bibIdentity = results[item].BibEntity[identifier]
        if(bibIdentity && bibIdentity !== null && bibIdentity !== undefined){
            return Object.keys(bibIdentity).map(keys => {
                if(bibIdentity[keys][key] === type){
                    data.push(bibIdentity[keys].Value)
                }
            })
           }
    })
    }
    return data
}

function processisPart(results, type, key){
    let data = []
    if(results){
    Object.keys(results).map(item => {
         const bibIdentity = results[item].BibEntity[type]
         if(bibIdentity && bibIdentity !== null && bibIdentity !== undefined){
         return Object.keys(bibIdentity).map(keys => {
             if(bibIdentity[keys][key]){
                 data.push(bibIdentity[keys][key])
             }
         })
        }
    })
    }
    return data
}

function processISBN(results){
    let data = []
    if(results){
    Object.keys(results).map(item => {
         const bibIdentity = results[item].BibEntity.Identifiers
         if(bibIdentity && bibIdentity !== null && bibIdentity !== undefined){
         return Object.keys(bibIdentity).map(keys => {
             if(bibIdentity[keys].Type === 'isbn-print'){
                 data.push(bibIdentity[keys].Value)
             }
         })
        }
    })
    }
    return data
}

function processIndividualItems(results, type){
    if(results){
    const item = Object.keys(results).map(items => {
        if(results[items].Name === type){
            return results[items].Data
        }
    })
    const result = item.filter(Boolean)
    if(result.length){
        const set = cleanData(decode(result[0]))
        return explodeBreaks(set, "<br />")
    }   
    } else {
        return ''
    }
}

function processDOIRecords(results, type){
    if(results){
        const item = Object.keys(results).map(items => {
            if(results[items].Name === type || 
              (results[items].Name === "ID" && results[items].Label === 'DOI') ||
              (results[items].Data.indexOf('dx.doi.org/' ) !== -1)
            ){
                
                return results[items].Data
            }
        })

        const result = item.filter(Boolean)
        if(result.length){
            const set = cleanData(decode(result[0]))
            console.log(results)
            if(set.isArray){
                return set.replace(/^.*:\/\/dx.doi.org\//, '').trim()
            } else {
                return [set.replace(/^.*:\/\/dx.doi.org\//, '').trim()]
            }     
        }    
    } else {
        return ''
    }
}


function processIndividualItemsLabel(results, type){
   if(results){ 
    const item = Object.keys(results).map(items => {
        if(results[items].Label === type){
            return results[items].Data
        }
    })
    const result = item.filter(Boolean)
    if(result.length){
        let set = cleanData(decode(result[0])).replace(/ocn/g, "")
        return explodeBreaks(set, "<br />")
    }    
} else {
    return ''
}   
}


function processIndividualSubjects(results, type){
    if(results){
    const item = Object.keys(results).map(items => {
        if(results[items].Name === type){
            return results[items].Data
        }
    })
    const resultSet = item.filter(Boolean)
    if(resultSet.length){
    const subject = resultSet && resultSet[0] ?  entities.decode(resultSet[0]) : ""
    let result = [subject]
    if (subject.indexOf(';') > -1) { result = subject.split(';') }
    if (subject.indexOf('<br />') > -1) { result = subject.split('<br />') }
    if(result.length){
    const response = result.map(set => {
        const values = {
            subject: [cleanData(decode(set))],
            term: [getTerm(decode(set))],
            fieldCode: [getFieldCode(decode(set))],
        }  
        return values
    }) 
    return response
    }
    }
    } else {
        return ''
    }
}


function processIndividualAuthors(results, type){
 if(results){   
    const item = Object.keys(results).map(items => {
        if(results[items].Name === type){
            return results[items].Data
        }
    })
    const result = item.filter(Boolean)
    let resultSet = result
    let set = resultSet && resultSet[0] ?  entities.decode(resultSet[0]) : ""
    if ( set.indexOf('<br />') > -1) {
        resultSet = set.split('<br />')
    }
    if ( set.indexOf(';') > -1) {
        resultSet = set.split(';')
    }
    const response = resultSet.map(set => {
        const values = {
            author: [cleanData(decode(set))],
            term: [getAuthorTerm(decode(set))],
            fieldCode: [getAuthorFieldCode(decode(set))],
        }   
        return values
    })
    return response
    } else {
        return ''
    }
}

function processIndividualOther(results, type){
  if(results){  
    const item = Object.keys(results).map(items => {
        if(results[items].Name === type){
            return results[items].Data
        }
    })
    const result = item.filter(Boolean)
    const response = result.map(set => {
        const values = cleanData(decode(set))
        return values
    })
    return response
    } else {
        return ''
    }  
}



function processQueryWithActions(criteria){
    if(criteria){
    criteria.map(items => {
        return items
    })
    }
}

const processPDF = (data, guest="y") => {
    if(data.Links && data.Links[0]){
        if(data.Links[0].Type === "pdflink" && guest === "n"){
            return true
        } else {
            return false
        }
    }
    return false
}

function processCustomLink(data){
    if(data.CustomLinks && data.CustomLinks[0]){
        if(data.CustomLinks[0].Url){
            return true
        } else {
            return false
        }
    }
    return false
}

function processOtherFullText(data){
    if(data.Links && data.Links[0]){
        if(data.Links[0].Type === "other"){
            return true
        } else {
            return false
        }
    }
    return false
}


function handleFacets(data){
    return {
        sourceType: handleFacetDisplay(data, "SourceType"),
        subject: handleFacetDisplay(data, "SubjectEDS"),
        publisher: handleFacetDisplay(data, "Publisher"),
        journal: handleFacetDisplay(data, "Journal"),
        language: handleFacetDisplay(data, "Language"),
        provider: handleFacetDisplay(data, "ContentProvider"),
        location: handleFacetDisplay(data, "LocationLibrary"),
        category: handleFacetDisplay(data, "Category"),
        year: handleFacetDisplay(data, "PublicationYear")
        
    }
}

function handleFacetDisplay(data, type){
    if(data){
    const set = Object.keys(data).map(items => {
        if(data[items].Id === type){
            return {
                id: data[items].Id,
                label: data[items].Label,
                values: handleAvailableFacets(data[items].AvailableFacetValues)
            }
        }    
    })
    const result = set.filter(Boolean)
    return result[0]
    }
}


function handleAvailableFacets(data){
    const item = data.filter(Boolean)
    return Object.keys(item).map(items => {
        return {
            value: item[items].Value,
            count: item[items].Count,
            action: item[items].AddAction,
            label: `${item[items].Value} (${item[items].Count})`
        }
    })
}

export function trainBrain(values){
    const action = values && values.action ? values.action.replace(/addfacetfilter(.*?):/g, "")
                                 .replace(/\)/g,"") : ''

    let query = values.query
    if(values.query.match(/query=(.*?)&/g)){
        values.query.match(/query=(.*?)&/g).map(items => {
            query = items.replace(/query=/g, "").replace(/\&/g, "")
        })
    }
    if(values.query.match(/query-1=(.*?)&/g)){
        values.query.match(/query-1=(.*?)&/g).map(items => {
            query = items.replace(/query-1=AND,/g, "").replace(/query-1=OR,/g, "").replace(/\&/g, "").replace(/\+/g, ' ')
        })
    }                 

    let data = {
        input: {},
        output: {}
    }
    data["input"] = query
    data["output"][action] = 1
    return data
}

export function handleGoogleImages(data, oclc){
    const results = data.replace(/var _GBSBookInfo = /g, "")
                        .replace(/;/g, "")
    return JSON.parse(results)
}

function cleanData(data){
  const results =  data.replace(/<searchLink(.*?)>/g, "")
              .replace(/<\/searchLink>/g, "")
              .replace(/<highlight>/g, "")
              .replace(/<\/highlight>/g, "")
              .replace(/<link linkTarget=\"URL\" linkTerm=\"/g, "")
              .replace(/" linkWindow=\"_blank\">(.*?)<\/link>/g, "")
              .replace(/<externalLink term=(.*?)>/g, "")
              .replace(/<\/externalLink>/g, "")
              .replace(/DOI: <externalLink term=\"\n(.*?)>/g, "")
              .replace(/<i>/g, "")
              .replace(/<\/i>/g, "")
              .replace(/&#39;/g, "'")
              .replace(/\(Subscriber access\)/g, "")
              .replace(/<link linkTarget="URL" (.*?)>/g, " ")
              .replace(/<\/link>/g, "")
              .replace(/<relatesTo>(.*?)<\/relatesTo>/g, " ")
              .replace(/Series: http(.*?)/g, "http")
    // const set = strip_html_tags(results)          

    return entities.decode(results)         
}

function getTerm(data){
    const results = data.replace(/<searchLink fieldCode="(.*?)" term="/g, "")
                        .replace(/">(.*?)<\/searchLink>(.*?)\;/g, ";")
                        .replace(/\">(.*?)<\/searchLink>/g, "")
     return results                    

}

function getFieldCode(data){
    const results = data.replace(/<searchLink fieldCode="/g, "")
                        .replace(/" term="(.*?)">(.*?)<\/searchLink>(.*?)\;/g, ";")
                        .replace(/" term="(.*?)">(.*?)<\/searchLink>/g, "")
    return results   
}

function getAuthorTerm(data){
    const results = data.replace(/<searchLink fieldCode="(.*?)" term="/g, "")
                        .replace(/">(.*?)<\/searchLink>.*/g, "")
    return results    
}

function getAuthorFieldCode(data){
    const results = data.replace(/<searchLink fieldCode="/g, "")
                        .replace(/" term="(.*?)">(.*?)<\/searchLink>.*/g, "")
    return results   
}


function explodeBreaks(data, splitType){
    return data.split(splitType)
}

function loadFromFile(barcode){
   const dataLocation = path.resolve(__dirname, '..','images',`${barcode}.jpg`);
   let image = null
   try {
   		if(fs.readFileSync(dataLocation, 'base64')){
	   		image = fs.readFileSync(dataLocation, 'base64')
   		}
 	} catch (err) {
  		if (err.code !== 'ENOENT') {
	  		image = null
  		}
  	}
  	return image
}

function strip_html_tags(str)
{
   if ((str===null) || (str===''))
       return false;
  else
   str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}


/* DPLA Processing */


export const DPLARecord = (items) => {
    const { count, start, limit , docs} = items
    return {
        count: count,
        start: start,
        limit, limit,
        docs: DPLADocs(items)
    }
}

const DPLADocs = (  { docs } ) => {
    return docs ? Object.keys(docs).map(items => {
        const { 
            dataProvider, 
            sourceResource,
            object,
            aggregatedCHO, 
            provider,
            ingestDate,
            id,
            originalRecord,
            isShownAt,
            ingestType 
        } = docs[items]
        return {
            dataProvider: dataProvider.toString(),
            sourceResource: DPLASourceResource(sourceResource) ,
            object: object,
            aggregatedCHO: aggregatedCHO,
            provider: provider,
            ingestDate: ingestDate,
            id: id,
            isShownAt: isShownAt,
            ingestType: ingestType
        }
    })
    : ''
}

const DPLASourceResource = (sourceResource) => {
    const { 
            description, 
            language, 
            rights, 
            type, 
            title,
            collection,
            spatial,
            date,
            subject
        } = sourceResource
    return {
        description: DetermineIfString(description), 
        language: language,
        rights: DetermineIfString(rights),
        type: DetermineIfString(type),
        title: title.toString(),
        collection: collection,
        spatial: spatial,
        date: date,
        subject: subject
    }
}


const DetermineIfString = (value) => {
    return typeof value === 'string' || value instanceof String ? [value] : value
}