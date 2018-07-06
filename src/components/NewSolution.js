import React, { Component } from 'react';
import { Container, Form, Button, Grid, Header } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";
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

class NewSolution extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      id: this.props.match.params.id,
      description: null,
      deadline: null,
      value: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let deadline = this.state.deadline ? this.state.deadline.getTime() : null;
    let formValidated = false;
    if (this.state.description && parseInt(this.state.value, 10) && this.state.deadline) {
      formValidated = true;
    }
    if (formValidated) {
      axios.post('http://localhost:5050/solutions/new', 
        stringify({
          description: this.state.description,
          author: localStorage.getItem('user_id'),
          value: this.state.value,
          deadline: deadline,
          occurrence: this.state.id
        })
      )
        .then(function (response) {
          this.props.history.push(`/occurrences/${this.state.id}`);
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  render () {
    if (localStorage.getItem('user_id') === "NULL") {
      this.props.history.push("/login");
    }
 
    return (
      <Container>
        <Grid centered>
          <Header as='h1'><FormattedMessage id='regist.solution' /></Header>
        </Grid>
        <Grid className="centered">
          <Grid.Row>
            <Grid.Column width={10}>
              <Form>      
                <Form.TextArea 
                  label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='description.solution' />:</strong>}
                  onChange={(e) => this.setState({ description: e.target.value })} 
                  placeholder='Description' 
                />
                <Form.Input 
                  label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='value.solution' /></strong>}
                  onChange={(e) => this.setState({ value: e.target.value })} 
                  placeholder='Value' 
                  type='number'
                />
                <p>
                  <strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "-8px" }}><FormattedMessage id='deadline.solution' /></strong>
                </p>
                <DayPickerInput onDayChange={(e) => this.setState({ deadline: e })} />
                <Button 
                  fluid 
                  onClick={this.handleSubmit} 
                  primary 
                  style={{ marginTop: "3%" }}
                >
                  Submit
                </Button>
              </Form>
              <Button 
                fluid 
                secondary 
                style={{ marginTop: "1%" }}
              >
                <Link 
                  style={{ color: "white" }} 
                  to={`/occurrences/${this.state.id}`}
                >
                  Go Back
                </Link>
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
};

export default NewSolution;
