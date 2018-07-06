import React, { Component } from 'react';
import { Container, Header, Button, Grid, Card } from 'semantic-ui-react';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';
import Spinner from 'react-spinkit';
import { stringify } from "qs";

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

class MyOccurrences extends Component {

  constructor(props) {
    super(props);
    this.state = {
      occurrences: [],
      loading: true
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5050/occurrences', {
      params: {
        user: localStorage.getItem('user_id')
      }
    })
      .then( (response) => {
        let occurrences = [];
        for (let i = 0; i < response.data.length; i++) {
          occurrences.push(
            <Card key={i} style={{ width: "100%" }}>
              <Card.Content>
                <Card.Header>
                  {response.data[i].title}
                  <Button 
                    color='red' 
                    disabled={!response.data[i].status} 
                    floated='right' 
                    onClick={() => { this.handleClose(response.data[i].id) }}
                  >
                    <FormattedMessage id='close' />
                  </Button>
                </Card.Header>
                <Card.Meta>
                  <Link to={`/occurrences/${response.data[i].id}`}>
                    <FormattedMessage id='see.more' />
                  </Link>
                </Card.Meta>
                <Card.Description>
                  {response.data[i].description}
                </Card.Description>
              </Card.Content>
            </Card>
          );
        }
        this.setState({
          occurrences: occurrences,
          loading: false
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleClose(id) {
    axios.post('http://localhost:5050/occurrences/close', 
      stringify({
        id: id
      })
    )
      .then( (response) => {
        window.location.reload();
      })
      .catch( (error) => {
        console.log(error);
      }); 
  }

  render () {
    if (localStorage.getItem('user_id') === "NULL") {
      this.props.history.push("/login");
    }
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
    return (
      <Container>
        <Grid centered>
          <Header as='h1'><FormattedMessage id='my.occurrences' /></Header>
        </Grid>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.state.occurrences}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
};

export default MyOccurrences;
