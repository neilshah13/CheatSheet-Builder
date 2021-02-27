import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ResultsPage from './ResultsPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



const routing = (
  <div id="style">
    <Router>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/results/:id' component={ResultsPage} render={(props) => {
          <ResultsPage user_id={props.match.params.id} />
        }} />
      </Switch>

    </Router>
  </div>
)

ReactDOM.render(routing, document.getElementById('root'))