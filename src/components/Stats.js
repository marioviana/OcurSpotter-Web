import React, { Component } from 'react';
import { Container, Grid, Header, Statistic } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import axios from 'axios';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      occurrences: 0,
      solutions: 0,
      users: 0,
      occurrenceVotes: 0,
      solutionVotes: 0,
      types: 0
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
          types: response.data.types
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }


  render() {
    localStorage.setItem('reload', 'NULL');
    return (
      <Container>
        <Grid centered>
          <Header as='h1'>Statistics</Header>
        </Grid>
        <Grid className="centered">
          <Grid.Row>
            <Grid.Column width={10}>
              <center><Statistic>
                <Statistic.Value>{this.state.occurrences}</Statistic.Value>
                <Statistic.Label>Occurrences</Statistic.Label>
              </Statistic></center><br/>
              <center><Statistic>
                <Statistic.Value>{this.state.solutions}</Statistic.Value>
                <Statistic.Label>Solutions</Statistic.Label>
              </Statistic></center><br/>
              <center><Statistic>
                <Statistic.Value>{this.state.users}</Statistic.Value>
                <Statistic.Label>Users</Statistic.Label>
              </Statistic></center><br/>
              <center><Statistic>
                <Statistic.Value>{this.state.occurrenceVotes}</Statistic.Value>
                <Statistic.Label>Votes in occurrences</Statistic.Label>
              </Statistic></center><br/>
              <center><Statistic>
                <Statistic.Value>{this.state.solutionVotes}</Statistic.Value>
                <Statistic.Label>Votes in solutions</Statistic.Label>
              </Statistic></center><br/>
              <center><Statistic>
                <Statistic.Value>{this.state.types}</Statistic.Value>
                <Statistic.Label>Types</Statistic.Label>
              </Statistic></center>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
};

export default Profile;