import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React from 'react'
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;


const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

export const YearSlider = (props) => (
    <div>
    {console.log(props)}

        <div className="row justify-content-md-center" style={{marginBottom: "10px"}}>
            <div className="col-md-5">
                <input 
                    className="form-control"  
                    value={props.yearLower} 
                    onChange={props.handleLower} 
                    // onKeyDown={(e) => props.handleKeyDown(e.target.value, props.yearUpper)}
                />
            </div>
            <div className="col-md-5">
                <input 
                    className="form-control"  
                    value={props.yearUpper}
                    onChange={props.handleUpper} 
                    // onKeyDown={(e) => props.handleKeyDown(props.yearLower, e.target.value)} 
                />
            </div>
        </div>
         <div className="col-md-auto">   
            <Range 
                min={1600}
                max={new Date().getFullYear() + 1} 
                value={[parseInt(props.sliderYearLower), parseInt(props.sliderYearUpper) ]}
                tipFormatter={value => `${value}%`}
                onAfterChange={props.handleYearUpdate}
                onChange={value => props.handleYearInputChange(value[0], value[1])}
        />
       </div>   
    </div>         
)