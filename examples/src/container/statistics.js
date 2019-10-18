import React, { Component } from 'react';
import { GET_STATISTICS } from '../scheme'
import { useQuery } from '@apollo/react-hooks';
import { HorizontalBar, Doughnut } from 'react-chartjs-2';
import { withApollo } from 'react-apollo';
import { Button, Input, Form, Card, CardBody, CardHeader, CardColumns } from 'reactstrap'

class App extends Component {
    state = {
        sourceCount: [],
        sourceLabel: [],
        sourceLength: 0,
        locationCount: [],
        locationLabel: [],
        providerCount: [],
        providerLabel: [],
        publisherCount: [],
        publisherLabel: [],
        journalCount: [],
        journalLabel: [],
        languageCount: [],
        languageLabel: [],
        search: 'SU:Climate Change'
    }

    componentDidMount(){
        this.getData()
    }


    getData = async () => {
      const { data, loading, error } = await this.props.client.query({
        query: GET_STATISTICS,
        variables: { 
          query: this.state.search,
        }
      })
      const { search } = data
      const { statistics, facets } = search || []
      const { sourceType, location, provider, publisher, journal, language } = facets || []
      const sourceValues = sourceType && sourceType.values ? sourceType.values : []
      const locationValues = location && location.values ? location.values : []
      const providerValues = provider && provider.values ? provider.values : []
      const publisherValues = publisher && publisher.values ? publisher.values : []
      const journalValues = journal && journal.values ? journal.values : []
      const languageValues = language && language.values ? language.values : []

      const sourceLabel = []
      const sourceCount = []
      const sourceLength = sourceLabel.length
      const locationCount = []
      const locationLabel = []
      const providerCount = []
      const providerLabel = []
      const publisherCount = []
      const publisherLabel = []
      const journalCount = []
      const journalLabel = []
      const languageCount = []
      const languageLabel = []

      Object.keys(sourceValues.slice(0,6)).map(items => {
        sourceLabel.push(sourceValues[items].value)
        sourceCount.push(sourceValues[items].count)
      })

      Object.keys(locationValues.slice(0,6)).map(items => {
        locationLabel.push(locationValues[items].value)
        locationCount.push(locationValues[items].count)
      })

      Object.keys(providerValues.slice(0,6)).map(items => {
        providerLabel.push(providerValues[items].value)
        providerCount.push(providerValues[items].count)
      })

      Object.keys(publisherValues.slice(0,6)).map(items => {
        publisherLabel.push(publisherValues[items].value)
        publisherCount.push(publisherValues[items].count)
      })

      Object.keys(journalValues.slice(0,6)).map(items => {
        journalLabel.push(journalValues[items].value)
        journalCount.push(journalValues[items].count)
      })

      Object.keys(languageValues.slice(0,6)).map(items => {
        languageLabel.push(languageValues[items].value)
        languageCount.push(languageValues[items].count)
      })
      

      this.setState({
        sourceCount,
        sourceLabel,
        sourceLength,
        locationCount,
        locationLabel,
        providerCount,
        providerLabel,
        publisherCount,
        publisherLabel,
        journalCount,
        journalLabel,
        languageCount,
        languageLabel
      })
    }
    
    handleChange = (e) => {
      e.preventDefault()
      this.setState({
        search: e.target.value
      })
    }

    handleSearch = (e) => {
      e.preventDefault()
      this.getData()
    }

    render(){
      return(
        <div className="container">
          <div style={{marginTop: "60px", marginBottom: "60px"}}>
            <Form inline onSubmit={(e) => this.handleSearch(e)}>
              <Input type="text" name="search" onChange={(e) => this.handleChange(e)} />
              <Button color="primary">Search</Button>
            </Form>  
          </div>   
          <Card md="6">
            <CardHeader>
              Material
            </CardHeader>  
            <CardBody>
              <SourceTypeGraph
                state={this.state}
              />
            </CardBody>
          </Card>
          <Card md="6">
            <CardHeader>
              Locations
            </CardHeader>  
            <CardBody>
              <LocationGraph
                state={this.state}
              />
            </CardBody>
          </Card>
          <Card md="6">
          <CardHeader>
              Providers
            </CardHeader> 
            <CardBody>
              <ProviderGraph
                state={this.state}
              />
            </CardBody>
          </Card>
          <Card md="6">
          <CardHeader>
              Publisher
            </CardHeader> 
            <CardBody>
              <PublisherGraph
                state={this.state}
              />
            </CardBody>
          </Card>
          <Card md="6">
          <CardHeader>
              Journal
            </CardHeader> 
            <CardBody>
              <JournalGraph
                state={this.state}
              />
            </CardBody>
          </Card>
          <Card md="6">
          <CardHeader>
              Language
            </CardHeader> 
            <CardBody>
              <LanguageGraph
                state={this.state}
              />
            </CardBody>
          </Card>
        </div>
      )
    }
}  


const BackGroundColors = () => [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
]

const SourceTypeGraph = ({ state }) => {
  const dataLength = state.sourceLabel ? state.sourceLabel.length : 0
  const data = {
    labels: state.sourceLabel,
    datasets: [{
      data: state.sourceCount,
      backgroundColor: BackGroundColors(),
    }]
  };
  return <Doughnut 
  data={data} 
/>
}

const LocationGraph = ({ state }) => {
  const dataLength = state.locationLabel ? state.locationLabel.length : 0
  const data = {
    labels: state.locationLabel,
    datasets: [{
      data: state.locationCount,
      backgroundColor: BackGroundColors(),
    }]
  };
  return <Doughnut 
    data={data} 
  />
}

const ProviderGraph = ({ state }) => {
  const dataLength = state.providerLabel ? state.providerLabel.length : 0
  const data = {
    labels: state.providerLabel,
    datasets: [{
      data: state.providerCount,
      backgroundColor: BackGroundColors(),
    }],
  };
  return <Doughnut 
    data={data} 
  />
}

const PublisherGraph = ({ state }) => {
  const dataLength = state.publisherLabel ? state.publisherLabel.length : 0
  const data = {
    labels: state.publisherLabel,
    datasets: [{
      data: state.publisherCount,
      backgroundColor: BackGroundColors(),
    }],
  };
  return <Doughnut 
    data={data} 
  />
}

const JournalGraph = ({ state }) => {
  const dataLength = state.journalLabel ? state.journalLabel.length : 0
  const data = {
    labels: state.journalLabel,
    datasets: [{
      data: state.journalCount,
      backgroundColor: BackGroundColors(),
    }],
  };
  return <Doughnut 
    data={data} 
  />
}

const LanguageGraph = ({ state }) => {
  const dataLength = state.languageLabel ? state.languageLabel.length : 0
  const data = {
    labels: state.languageLabel,
    datasets: [{
      data: state.languageCount,
      backgroundColor: BackGroundColors(),
    }],
  };
  return <Doughnut 
    data={data} 
  />
}



export default withApollo(App)