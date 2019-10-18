import { gql } from "apollo-boost"


export const GET_STATISTICS = gql`
query search($query: String!, $action: String, $refine: String, $fieldcode: String){
  search(query: $query, action: $action, refine: $refine, fieldcode: $fieldcode) {
        statistics{
            hits
          }
          facets  {
            sourceType {
              id
              label
              values {
                action
                count
                value
                label
              }
            }
            location{
              id
              label  
              values {
                value
                action
                count
                label
              }
            }
            provider {
              id
              label  
              values {
                value
                action
                count
                label
              }
            }
            publisher {
              id
              label  
              values {
                value
                action
                count
                label
              }
            }
            subject {
              id
              label  
              values {
                value
                action
                count
                label
              }
            }
            journal {
              id
              label  
              values {
                value
                action
                count
                label
              }
            }
            language {
              id
              label  
              values {
                value
                action
                count
                label
              }
            }
          }
    }
}        
`

export const GET_BROWSE = gql`
query search($query: String!, $action: String, $refine: String){
  search(query: $query, action: $action, refine: $refine) {
    queryString
    queryWithAction{
      Query{
        BooleanOperator
        FieldCode
        Term
      }
      RemoveAction
    }
    limtersWithAction {
      Id
      RemoveAction
      LimiterValuesWithAction {
        Value
      }
    }
    expandersWithAction{
        Id
        RemoveAction
      }
    facetFiltersWithAction {
      RemoveAction
      FacetValuesWithAction {
        FacetValue {
          Id
          Value
        }
        RemoveAction
      }
    }
    statistics {
      hits
      time
    }
    records {
      id
      titleItem
      titles{
        TitleFull
      }
      an
      dbid
      pubType
      pubTypeId
      imageItem
      image{
        Target
        Size
    }
    googleImages{
        thumbnail_url
      }
    tmdbSearch{
        results{
          title
          poster_path
        }
      }
    }
    facets  {
      location{
        id
        label  
        values {
          value
          action
          count
          label
        }
      }
      publisher {
        id
        label  
        values {
          value
          action
          count
          label
        }
      }
      subject {
        id
        label  
        values {
          value
          action
          count
          label
        }
      }
      language {
        id
        label  
        values {
          value
          action
          count
          label
        }
      }
    }
  }
}  
`
