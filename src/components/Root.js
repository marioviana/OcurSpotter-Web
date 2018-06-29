/* eslint react/jsx-max-props-per-line: 0 */
/* eslint react/jsx-sort-props: 0 */ 
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import App from './App';
import Home from './Home';
import About from './About';
import Occurrences from './Occurrences';
import Map from './Map';
import Login from './Login';
import NewOccurrence from './NewOccurrence';
import Solutions from './Solutions';
import NewSolution from './NewSolution';
import MyOccurrences from './MyOccurrences';

const Root = (props) => {
  return (
    <Router>
      <App>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/map" component={Map} />
          <Route path="/login" component={Login} />
          <Route path="/occurrence" component={NewOccurrence} />
          <Route path="/solution/:id" component={NewSolution} />
          <Route path="/occurrences/:id" component={Occurrences} />
          <Route path="/solutions/:idS" component={Solutions} />
          <Route path="/my/occurrences" component={MyOccurrences} />
          <Route path="/solutions/my" component={Home} />
          <Route path="*" component={Home} />
        </Switch>
      </App>
    </Router>
  );
};

export default Root;
