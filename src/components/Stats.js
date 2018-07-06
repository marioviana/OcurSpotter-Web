import React, { Component } from 'react';
import { Container, Grid, Header, Statistic } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Spinner from 'react-spinkit';

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

class Stats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      occurrences: 0,
      solutions: 0,
      users: 0,
      occurrenceVotes: 0,
      solutionVotes: 0,
      types: 0,
      loading: true,
    };
  }

  componentWillMount() {
    axios.get('http://localhost:5050/stats')
      .then( (response) => {
        this.setState({
          occurrences: response.data.occurrences,
          solutions: response.data.solutions,
          users: response.data.users,
          occurrenceVotes: response.data.occurrenceVotes,
          solutionVotes: response.data.solutionVotes,
          types: response.data.types,
          loading: false
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }


  render() {
    if (this.state.loading) {
      return (
        <center>
          <Spinner 
            name="ball-scale-ripple" 
            style={{ marginTop: "25%" }}
          />
        </center>
      );
    }
    console.log(this.props.intl);
    return (
      <Container>
        <Grid centered>
          <Header as='h1'><FormattedMessage id='stats' /></Header>
        </Grid>
        <Grid className="centered">
          <Grid.Row>
            <Grid.Column width={10}>
              <center>
                <Statistic>
                  <Statistic.Value>{this.state.occurrences}</Statistic.Value>
                  <Statistic.Label><FormattedMessage id='occurrences' /></Statistic.Label>
                </Statistic>
              </center>
              <br />
              <center>
                <Statistic>
                  <Statistic.Value>{this.state.solutions}</Statistic.Value>
                  <Statistic.Label><FormattedMessage id='solutions' /></Statistic.Label>
                </Statistic>
              </center>
              <br />
              <center>
                <Statistic>
                  <Statistic.Value>{this.state.users}</Statistic.Value>
                  <Statistic.Label><FormattedMessage id='users' /></Statistic.Label>
                </Statistic>
              </center>
              <br />
              <center>
                <Statistic>
                  <Statistic.Value>{this.state.occurrenceVotes}</Statistic.Value>
                  <Statistic.Label><FormattedMessage id='votesOccurrences' /></Statistic.Label>
                </Statistic>
              </center>
              <br />
              <center>
                <Statistic>
                  <Statistic.Value>{this.state.solutionVotes}</Statistic.Value>
                  <Statistic.Label><FormattedMessage id='votesSolutions' /></Statistic.Label>
                </Statistic>
              </center>
              <br />
              <center>
                <Statistic>
                  <Statistic.Value>{this.state.types}</Statistic.Value>
                  <Statistic.Label><FormattedMessage id='types' /></Statistic.Label>
                </Statistic>
              </center>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
};

export default Stats;
