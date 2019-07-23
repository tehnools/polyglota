import React from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import Landing from './Landing'
import Profile from './Profile'
import PotMatches from './PotMatches'
import Navbar from './Navbar'
import ListMatches from './ListMatches'
import UpdateProfile from './UpdateProfile'

class App extends React.Component {
  render () {
    return (
      <Router>
        <>
        <Navbar />
          <Container>
            <Switch>
              <Route exact path='/landing' component={Landing} />
              <Route exact path='/pot' component={PotMatches}/>
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/matches' component={ListMatches} />
              <Route exact path='/update' component={UpdateProfile} />
            </Switch>
          </Container>
        </>
      </Router>
    )
  }
}

export default App
