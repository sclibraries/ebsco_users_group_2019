import React, { useState, useEffect } from 'react'
import { GET_BROWSE } from '../scheme'
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import Masonry from 'react-masonry-css'
import { Card, CardImg, CardBody, CardTitle, Form, Input, Col, Row, Button } from 'reactstrap'
import Select from 'react-select'
import BottomScrollListener from 'react-bottom-scroll-listener';
import queryString from 'query-string'
import { videoStartQueryData, bookStartQueryData, videoGenre, bookFiction } from '../static'
import { debounce } from 'lodash'
import Skeleton from 'react-loading-skeleton';

//Global variables 

//Sets the Masonry breakpoints for the Display
const breakpointColumnsObj = {
    default: 6,
    1500: 5,
    1200: 4,
    900: 3,
    700: 2,
    500: 1
  };

const baseImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgBMADLAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8ArUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/2Q=="

const videoGenreData = videoGenre.sort().map(items => {
    return {
      label: items.trim(),
      value: `addfacetfilter(SubjectEDS:${items.trim()})`
    }
  })

  const bookFictionData = bookFiction.sort().map(items => {
    return {
      label: items.trim(),
      value: `addfacetfilter(SubjectEDS:${items.trim()})`
    }
  })

  const materialData = [
      {label: 'Video', value:queryString.stringify(videoStartQueryData)},
      {label: "Books", value:queryString.stringify(bookStartQueryData)}
  ]

  const years = () => {
    let currentYear = new Date().getFullYear(), years = [];
    for(let i = currentYear; i >= currentYear-100; i--) {
        years.push(
            {
                label: `${i}`, 
                value: `addlimiter(DT1:${i}-01/${i}-12)`
            }
        );
    }   
    return years;
}

export const Browse = ({ }) => {
    const [initialQuery] = useState(queryString.stringify(videoStartQueryData))
    const [results, setResults] = useState({
        searchString: '',
        action: '',
    })
    const [page, setPage] = useState(1)
    const [material, setMaterial] = useState('Video')

    const { loading, error, data, refetch, fetchMore } = useQuery(GET_BROWSE, {
        variables: { 
            query: results && results.searchString !== '' ? results.searchString : initialQuery,
            refine: "y",
            action: results.action
        },
        fetchPolicy: "cache-and-network"
      });

      const { search } = data || []
      const { 
          records, 
          facets, 
          statistics,
          facetFiltersWithAction, 
          expandersWithAction, 
          limtersWithAction,
          queryWithAction 
        } = search || []

       
       const { hits } = statistics || -1
    
      const updateFacets = (value, string) => (
          setResults({
              searchString: string,
              action: value.value
          })
      )

      const updateMaterial = (string) => (
          setMaterial(string.label),
          setResults({
              searchString: string.value
          })
      )

      const handleBrowseFacetUpdate = (value) => (
          setResults({
              searchString: results.searchString,
              action: value
          })
      )

      const updateSearch = (e, queryString) => {
          console.log(queryString)
          const value = e.target.value || '*'
          const sort = value === '*' ? 'date' : 'relevance'
          const search = queryString.replace(/query-1=AND,(.*?)&/g, `query-1=AND,${value}&`).replace(/&sort=(.*?)&/g, `&sort=${sort}&`)
          handleFilter(search)
      }

      const handleFilter = debounce((val) => {
          setResults({searchString: val})
      }, 500)

      return(
        <div style={{paddingTop: "50px", marginBottom: '20px'}} > 
        <div style={{paddingLeft: "50px", paddingRight: "50px", marginBottom: '20px'}}>     
            <FacetOptions
                queryString={search && search.queryString ? search.queryString : ''}
                facets={facets}
                updateFacets={updateFacets}
                updateMaterial={updateMaterial}
                material={material}
                updateSearch={updateSearch}
            />
        </div>  
        <div style={{paddingLeft: "50px", paddingRight: "50px"}}>
            <ToolBar
                facetFiltersWithAction={facetFiltersWithAction}
                expandersWithAction={expandersWithAction}
                limitersWithAction={limtersWithAction}
                queryWithAction={queryWithAction}
                handleBrowseFacetUpdate={handleBrowseFacetUpdate}
            />
        </div>      
        <br />
        <div style={{paddingLeft: "50px", paddingRight: "50px"}}>   
        <p><strong>Results: {hits && hits > 0 ? hits : 0}</strong></p>
        <Display
            records={records || []}
            hits={hits}
            page={page}
            loading={loading}
            queryString={search && search.queryString ? search.queryString : ''}
            onLoadMore={(queryString, page) =>
                fetchMore({
                    query: GET_BROWSE,
                        variables: { 
                        query: queryString,
                        refine: 'y',
                        action: `GoToPage(${page})`
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        setPage(page)
                        const previousEntry = previousResult.search;
                        const newRecords = fetchMoreResult.search.records;
                        return {
                            search: {
                              queryString: fetchMoreResult.search.queryString,  
                              records: [...previousEntry.records, ...newRecords],
                              __typename: "Results"
                            },
                          };
                      }
                    })
                  }
            />
          </div>  
        </div>
      )

}


const FacetOptions = ({ facets, queryString, updateFacets, updateMaterial, material, updateSearch }) => (
    <div>
        <Row>
            <Col>
            <Select 
                placeholder="Year"
                options={years()} 
                onChange={(e) => updateFacets(e, queryString)}
            />
            </Col>
            <Col>
            <Select 
                placeholder="Material"
                options={materialData} 
                onChange={(e) => updateMaterial(e)}
            />
            </Col>
            <Col>
            <Select 
                placeholder="Genre"
                options={material === "Video" ? videoGenreData : bookFictionData} 
                onChange={(e) => updateFacets(e, queryString)}
            />
            </Col>
            <Col>
                <Input type="text" onChange={(e) => updateSearch(e, queryString)} />
            </Col>
            {/* {facets ? Object.keys(facets).map((key, index) =>
                facets[key] && facets[key].values? 
                    <Col key={index}>
                        <Select
                            onChange={(e) => updateFacets(e, queryString)}
                            placeholder={facets[key].label}
                            options={facets[key].values}  
                            placeholder={facets[key].label}       
                        />  
                    </Col>
                : ''
            ): ''} */}
        </Row>    
    </div>    
)

const Display = ({ records, queryString, hits, position, page, onLoadMore, loading }) => {
    const totalPages = Math.ceil(hits/20)
    const handleOnDocumentBottom = () => {
            if(page <= totalPages && totalPages !== 1 ){
                onLoadMore(queryString, page +1) 
            }     
    }
    return( 
    <div >
      <BottomScrollListener  debounce={600} onBottom={handleOnDocumentBottom}>   
        <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
    >    
    {loading === false ? Object.keys(records).map((items, idx) => {
        let image = baseImage
        if(records[items].imageItem && records[items].imageItem !== null ){
            image = records[items].imageItem
        } else if(records[items].tmdbSearch && records[items].tmdbSearch.results && records[items].tmdbSearch.results[0] && records[items].tmdbSearch.results[0].poster_path ) {
            image = `https://image.tmdb.org/t/p/w500/${records[items].tmdbSearch.results[0].poster_path}`
        } else if(records[items].googleImages && records[items].googleImages.thumbnail_url){
            image = records[items].googleImages.thumbnail_url
        }
        return(
        <Card key={idx}>
            <CardImg
                top
                src={image} alt={records[items].titles && records[items].titles[0] 
                ? records[items].titles[0].TitleFull 
                : ''}
            />
            <CardBody>
            <CardTitle>{
                records[items].titles && records[items].titles[0] 
                ? records[items].titles[0].TitleFull 
                : ''}
            </CardTitle>
            </CardBody> 
        </Card>
        )
    }) : 
    [...Array(20)].map((x, i) =>
    <Card>
    <Skeleton height={370} />
    <CardBody>
    <CardTitle>
        <Skeleton />
    </CardTitle>
    </CardBody> 
    </Card> 
    )}   
    </Masonry>  
    {loading ? 'Loading...' : ''}
        </BottomScrollListener>
    </div> 
    )
}

const ToolBar = ({ 
    handleMaterial, 
    expandersWithAction, 
    facetFiltersWithAction, 
    limitersWithAction, 
    queryWithAction, 
    handleBrowseFacetUpdate, 
    handleClear={} 
}) => (
    <Row>
        {/* {queryWithAction ? Object.keys(queryWithAction).map(items =>
               <QueryWithAction 
                    key={items}
                    index={items}
                    data={queryWithAction[items]}
                    display="Applied Queries"
                    handleRemove={handleClear}
               />
              )
         : ''  }  */}
        {expandersWithAction ? Object.keys(expandersWithAction).map(items =>
               <ExpandersWithAction 
                    key={items}
                    index={items}
                    data={expandersWithAction[items]}
                    display="Applied Expanders"
                    handleRemove={handleBrowseFacetUpdate}
               />
              )
           : ''} 
           {facetFiltersWithAction ? Object.keys(facetFiltersWithAction).map(items =>
               <FiltersWithAction 
                    key={items}
                    index={items}
                    data={facetFiltersWithAction[items]}
                    display="Applied Facets"
                    handleRemove={handleBrowseFacetUpdate}
               />
              )
           : ''} 
           {limitersWithAction ? Object.keys(limitersWithAction).map(items =>
               <LimitersWithAction 
                    key={items}
                    index={items}
                    data={limitersWithAction[items]}
                    display="Applied Limiters"
                    handleRemove={handleBrowseFacetUpdate}
               />
              )
           : ''} 
        </Row>    
)


const FiltersWithAction = ({ data, handleRemove, lockSearchValue, locked }) => {
    return Object.keys(data.FacetValuesWithAction).map((items, index) => 
    <div className="btn-group" role="group" key={index} style={{padding: "5px"}}>
        <Button outline color="danger"  onClick={(e) => handleRemove(data.FacetValuesWithAction[items].RemoveAction)}>
            {data.FacetValuesWithAction[items].FacetValue.Value}   
        </Button> 
    </div>
    )
}

const ExpandersWithAction = ({ data, handleRemove }) => (
    <div className="btn-group" role="group" style={{padding: "5px"}}>
        <button type="button" style={{border: '1px solid #6C757D'}} className="btn btn-light" onClick={(e) => handleRemove(data.RemoveAction)}>
            {data.Id}  
        </button>
    </div>
)


const QueryWithAction = ({ data, handleRemove }) => {
    if(data.Query.Term !== "*"){
    return(
        <div className="btn-group" role="group" style={{paddingLeft: "5px"}}>
            <button 
                type="button" 
                style={{border: '1px solid #6C757D'}} 
                className="btn btn-light" 
                onClick={(e) => handleRemove(e)}
            >
                {data.Query.Term}  
            </button>
        </div>
    )
    } else {
        return ''
    }
}

const LimitersWithAction = ({ data, handleRemove }) => (
        Object.keys(data.LimiterValuesWithAction).map((items, key) => 
        <div key={key} className="btn-group" role="group" style={{padding: "5px"}}>
                {console.log(data)}
            <button 
                type="button" 
                className="btn btn-light" 
                style={{border: '1px solid #6C757D'}} 
                onClick={(e) => handleRemove(data.RemoveAction)}
            >
                {data.LimiterValuesWithAction[items].Value}  
            </button>
        </div>
        )
)


