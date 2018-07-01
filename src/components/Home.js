import React, { Component } from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

class Home extends Component {

  render() {
    localStorage.setItem('reload', 'NULL');
    return (
      <Container>
        <Grid centered><Grid.Row><Grid.Column width={10} style={{ marginTop: "15%" }}>
          <Image src={"/logo+name.png"} rounded /><p></p>
        </Grid.Column></Grid.Row></Grid>
      </Container>
    );
  }
};

export default Home;
