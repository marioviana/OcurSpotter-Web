import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Sidenav from './Sidenav';
import { Container } from 'semantic-ui-react';

const App = ({ children }) => {
  return (
    <div>
      <Sidenav />
      <Container style={{ marginTop: "5%" }}>
        {children}
      </Container>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node,
};

export default App;
