import React from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';

const About = () => {
  return (
    <Container>
      <Grid centered>
        <Header as='h1'>About</Header>
      </Grid>
      <Grid 
        centered 
        style={{ marginTop: "5%" }}
      >
        <Grid.Row>
          <Grid.Column width={10}>
            <p>With the expected increase of the population that lives in the urban cities, 
            the concept of a smart city is becoming more concrete due to the necessity of 
            adaptation, considering its sustainability and competitiveness.</p> 
          
            <p>The hope is that modern society will be able to deal with the multitude of issues that urban 
            inhabitants are already facing, which will doubtless be further exacerbated as 
            cities continue to expand.</p>
          
            <p>Therefore, instead of traveling to the city hall to 
            register an occurrence, the user may have a 24-hour service that is portable and 
            easier to create events. Its proficiency and facility to get into a smartphone 
            is a plus point to encourage the citizens to use it, thus using existing resources 
            to make the city smarter. This service will be the application (mobile and web) 
            built within the scope of this thesis, which allows to record the occurrences 
            efficiently.</p> 
          
            <p>In this way, Artificial Intelligence will perform an important role 
            in this field, since it recognizes patterns and, in an efficient way, find and 
            suggest better solutions, which will be applied with a machine learning method 
            in order to anticipate occurrences to make the city proactive, trying to anticipate 
            and solve their problems in advance.</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default About;
