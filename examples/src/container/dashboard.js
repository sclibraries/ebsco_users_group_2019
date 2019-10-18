import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardTitle, CardText, CardBody, CardImg, Row, Col } from 'reactstrap'

//Simple Dashboard to link between Statistics and browsing.  Not necessary if you just want to use one or the other.

export const Dashboard = () => (
    <div className="container" style={{marginTop: "60px"}}>
        <Row>
            <Col md="6">
                <Link to="/statistics">
                    <Card>
                        <CardImg top width="100%" src="https://reactjsexample.com/content/images/2018/07/react-chartjs-2.png" alt="react-charts" />
                        <CardBody>
                            <CardTitle>Statistics</CardTitle>
                            <CardText>Simple statistics display of the EDS API facets</CardText>
                        </CardBody>    
                    </Card>   
                </Link>
            </Col>
            <Col md="6">
                <Link to="/browse">
                    <Card>
                    <CardImg top width="100%" src="https://libraries.smith.edu/sites/default/files/styles/featured_item_minor_image/public/here_now_grid/right_content/graphic-novels-comics-featured.jpg?itok=dn2NvJOp" alt="react-charts" />
                    <CardBody>
                        <CardTitle>Browse</CardTitle>
                        <CardText>Simple Browsing display of movies and books</CardText>
                    </CardBody>    
                    </Card>   
                </Link>
             </Col>
        </Row>        
    </div>    
)