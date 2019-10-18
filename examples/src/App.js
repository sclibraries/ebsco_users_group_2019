import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { defaultState } from './static/'
import { Dashboard } from './container/dashboard'
import Header from './component/header'
import Statistics from './container/statistics'
import { Browse } from './container/browse'

export default class App extends Component {

  render(){
    return(
      <div>
          <Router>
              <Header />
              <Switch>
                <Route exact path="/"><Dashboard /></Route>
                <Route path="/statistics"><Statistics /></Route>
                <Route path="/browse"><Browse /></Route>
              </Switch>  
          </Router>  
      </div>  
    )
  }
}