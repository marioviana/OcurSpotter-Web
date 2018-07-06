/* eslint react/jsx-max-props-per-line: 0 */
/* eslint react/jsx-sort-props: 0 */ 
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import intlEN from 'react-intl/locale-data/en';
import intlES from 'react-intl/locale-data/es';
import intlMessagesES from '../utils/es.json';
import intlMessagesEN from '../utils/en.json';
import intlMessagesPT from '../utils/pt.json';
import intlMessagesFR from '../utils/fr.json';
import intlMessagesDE from '../utils/de.json';

addLocaleData([...intlEN, ...intlES]);

import App from './App';
import Home from './Home';
import About from './About';
import Occurrences from './Occurrences';
import Maps from './Maps';
import Login from './Login';
import NewOccurrence from './NewOccurrence';
import Solutions from './Solutions';
import NewSolution from './NewSolution';
import MyOccurrences from './MyOccurrences';
import Profile from './Profile';
import Stats from './Stats';

class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      locale: null,
      i18nConfig: {
        locale: 'en',
        messages: intlMessagesEN
      }
    };
  }

  onChangeLanguage(lang) {
    switch (lang) {
      case 'es': this.setState({
        i18nConfig: {
          locale: 'es',
          messages: intlMessagesES
        }
      }); break;
      case 'en': this.setState({
        i18nConfig: {
          locale: 'en',
          messages: intlMessagesEN
        }
      }); break;
      case 'pt': this.setState({
        i18nConfig: {
          locale: 'pt',
          messages: intlMessagesPT
        }
      }); break;
      case 'fr': this.setState({
        i18nConfig: {
          locale: 'fr',
          messages: intlMessagesFR
        }
      }); break;
      case 'de': this.setState({
        i18nConfig: {
          locale: 'de',
          messages: intlMessagesDE
        }
      }); break;
      default: break;
    }
  }

  render() {
    return (
      <IntlProvider key={this.state.i18nConfig.locale} locale={this.state.i18nConfig.locale} messages={this.state.i18nConfig.messages}>
        <Router>
          <App changeLang={this.onChangeLanguage.bind(this)} locale={this.state.i18nConfig.locale}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/map" component={Maps} />
              <Route path="/login" component={Login} />
              <Route path="/occurrence" component={NewOccurrence} />
              <Route path="/solution/:id" component={NewSolution} />
              <Route path="/occurrences/:id" component={Occurrences} />
              <Route path="/solutions/:idS" component={Solutions} />
              <Route path="/my/occurrences" component={MyOccurrences} />
              <Route path="/profile" component={Profile} />
              <Route path="/stats" component={Stats} />
              <Route path="*" component={Home} />
            </Switch>
          </App>
        </Router>
      </IntlProvider>
    );
  }
}

export default Root;
