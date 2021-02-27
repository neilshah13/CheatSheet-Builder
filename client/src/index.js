import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ResultsPage from './ResultsPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// ReactDOM.render(
//   <React.StrictMode>
//     <App>
//       <Router>
//         <Switch>
//           <Route exact path='/' component={UploadFile} />
//           <Route path='/results' component={ResultsPage} />
//         </Switch>
//       </Router>
//     </App>
//   </React.StrictMode>,
//   document.getElementById('root')
// );


const routing = (
  <div id="style">
    <Router>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/results/:user_id' component={ResultsPage} />
      </Switch>

    </Router>
  </div>
)

ReactDOM.render(routing, document.getElementById('root'))