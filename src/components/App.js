import React from 'react';
import PropTypes from 'prop-types';
import Sidenav from './Sidenav';
import { Container } from 'semantic-ui-react';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Sidenav changeLang={this.props.changeLang} locale={this.props.locale}/>
        <Container style={{ marginTop: "5%" }}>
          {this.props.children}
        </Container>
      </div>
    );
  };
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
