import React from 'react'

export const FiltersWithAction = ({ data, handleRemove, lockSearchValue, locked }) => {
    return Object.keys(data.FacetValuesWithAction).map((items, index) => 
    <div className="btn-group" role="group" key={index} style={{padding: "5px"}}>
    {console.log(data.FacetValuesWithAction[items].RemoveAction)}
        <button type="button" className={locked && locked.includes(data.FacetValuesWithAction[items].RemoveAction.replace("removefacetfiltervalue(", '').replace(")", "")) ? "btn btn-danger" : "btn btn-light"} style={{border: '1px solid #6C757D'}} onClick={(e) => handleRemove(data.FacetValuesWithAction[items].RemoveAction)}>
            {data.FacetValuesWithAction[items].FacetValue.Value}
            <span className="badge badge-pill">
                <FontAwesomeIcon icon={['far', "times-circle"]} />
            </span>    
        </button>
        <button 
            type="button"
            className={locked && locked.includes(data.FacetValuesWithAction[items].RemoveAction.replace("removefacetfiltervalue(", '').replace(")", "")) ? "btn btn-danger" : "btn btn-light"} 
            style={{borderTop: '1px solid #6C757D', borderRight: '1px solid #6C757D', borderBottom: '1px solid #6C757D'}} 
            onClick={
                (e) => 
                    lockSearchValue(locked && locked.includes(data.FacetValuesWithAction[items].RemoveAction.replace("removefacetfiltervalue(", '').replace(")", "")) 
                        ? data.FacetValuesWithAction[items].RemoveAction
                        : data.FacetValuesWithAction[items].RemoveAction)}
        >
        </button>    
    </div>
    )
}

export const ExpandersWithAction = ({ data, handleRemove }) => (
    <div className="btn-group" role="group" style={{padding: "5px"}}>
        <button type="button" style={{border: '1px solid #6C757D'}} className="btn btn-light" onClick={(e) => handleRemove(data.RemoveAction)}>
            {data.Id}  
            <span className="badge badge-pill">
                <FontAwesomeIcon icon={['far', "times-circle"]} />
            </span>
        </button>
    </div>
)


export const QueryWithAction = ({ data, handleRemove }) => {
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
                <span className="badge badge-pill">
                    <FontAwesomeIcon icon={['far', "times-circle"]} />
                </span>
            </button>
        </div>
    )
    } else {
        return ''
    }
}

export const LimitersWithAction = ({ data, handleRemove }) => (
        Object.keys(data.LimiterValuesWithAction).map((items, key) => 
        <div key={key} className="btn-group" role="group" style={{padding: "5px"}}>
            <button 
                type="button" 
                className="btn btn-light" 
                style={{border: '1px solid #6C757D'}} 
                onClick={(e) => handleRemove(data.RemoveAction)}
            >
                {data.LimiterValuesWithAction[items].Value} 
                <span className="badge badge-pill">
                    <FontAwesomeIcon icon={['far', "times-circle"]} />
                </span>    
            </button>
        </div>
        )
)
