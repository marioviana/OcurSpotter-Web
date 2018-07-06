import React from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

const Home = () => {
  return (
    <Container>
      <Grid centered>
        <Grid.Row>
          <Grid.Column style={{ marginTop: "15%" }} width={10}>
            <Image rounded src={"/logo+name.png"} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Home;
