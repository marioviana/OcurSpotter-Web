import React from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import pt from 'react-intl/locale-data/pt';
import de from 'react-intl/locale-data/de';

addLocaleData([...en, ...fr, ...es, ...pt, ...de]);

import {
    injectIntl,
    IntlProvider,
    FormattedRelative,
    FormattedMessage
} from 'react-intl';

const About = () => (
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
          <p><FormattedMessage id='about1' /></p> 
          <p><FormattedMessage id='about2' /></p>
          <p><FormattedMessage id='about3' /></p> 
          <p><FormattedMessage id='about4' /></p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

export default About;
