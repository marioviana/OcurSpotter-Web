import React, { Component } from 'react';
import { Container, Label, Button, Grid, Icon, Header, Image, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-spinkit';
import axios from 'axios';
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

class Solutions extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      idOccurrence: this.props.location.state.occId,
      idSolution: this.props.match.params.idS,
      occTitle: this.props.location.state.occTitle || '',
      occImage: this.props.location.state.occImage || '',
      upvoteColor: "grey",
      downvoteColor: "grey",
      loading: true,
      upvoteExists: false
    };
    this.handleDownvote = this.handleDownvote.bind(this);
    this.handleUpvote = this.handleUpvote.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5050/solutions/' + this.state.idSolution)
      .then( (response) => {
        this.setState({
          loading: false,
          downvotes: response.data.downvotes,
          openDate: response.data.openDate,
          deadline: response.data.deadline,
          upvotes: response.data.upvotes,
          description: response.data.description,
          status: response.data.status,
          creator: response.data.user,
          value: response.data.value
        });
      })
      .catch( (error) => {
        console.log(error);
      });
    axios.get('http://localhost:5050/solutionVotes/pair', {
      params: {
        user: localStorage.getItem('user_id'),
        solution: this.state.idSolution
      }
    })
      .then( (response) => {
        if (response.data === true) {
          this.setState({
            upvoteColor: "#2185d0",
            upvoteExists: true
          });
        } else if (response.data === false) {
          this.setState({
            downvoteColor: "#db2828",
            upvoteExists: true
          });
        } 
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleUpvote() {
    if (this.state.upvoteColor !== '#2185d0') {
      axios.post('http://localhost:5050/solutionVotes/new',
        stringify({
          user: localStorage.getItem('user_id'),
          solution: this.state.idSolution,
          vote: true,
          exists: this.state.upvoteExists
        })
      )
        .then( (response) => {
          let upvotes = this.state.upvoteExists ? this.state.upvotes + 2 : this.state.upvotes + 1;
          this.setState({
            upvoteColor: "#2185d0",
            downvoteColor: "grey",
            upvotes: upvotes
          });
        })
        .catch( (error) => {
          console.log(error);
        }); 
    }
  }

  handleDownvote() {
    if (this.state.downvoteColor !== '#db2828') {
      axios.post('http://localhost:5050/solutionVotes/new',
        stringify({
          user: localStorage.getItem('user_id'),
          solution: this.state.idSolution,
          vote: false,
          exists: this.state.upvoteExists
        })
      )
        .then( (response) => {
          let upvotes = this.state.upvoteExists ? this.state.upvotes - 2 : this.state.upvotes - 1;
          this.setState({
            downvoteColor: "#db2828",
            upvoteColor: "grey",
            upvotes: upvotes
          });
        })
        .catch( (error) => {
          console.log(error);
        }); 
    }
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
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      openDate = this.state.openDate ? new Date(this.state.openDate).toLocaleDateString('en-US', options) : '',
      deadline = this.state.deadline ? new Date(this.state.deadline).toLocaleDateString('en-US', options) : '',
      creatorName = `${this.state.creator.firstName} ${this.state.creator.lastName}`;
    return (
      <Container>
        <Grid centered>
          <Header as='h2'>
            <Link 
              to={`/occurrences/${this.state.idOccurrence}`}
            >
              <span style={{ color: "black" }}>
                {this.state.occTitle}
                <Label horizontal><FormattedMessage id='solution' /></Label>
              </span>
            </Link>
          </Header>
        </Grid>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={10}>
              <Image src={this.state.occImage} /><br />
              <p>
                <strong><FormattedMessage id='description' />: </strong>
                {this.state.description}
              </p>
              <p>
                <strong><FormattedMessage id='open.date' />: </strong>
                {openDate}
              </p>
              <p>
                <strong><FormattedMessage id='deadline' />: </strong>
                {deadline}
              </p>
              <p>
                <strong><FormattedMessage id='value' />: </strong>
                {this.state.value} $
              </p>          
              <p>
                <strong><FormattedMessage id='creator' />: </strong>
                <Label 
                  as='a' 
                  image 
                  style={{ backgroundColor: 'white' }}
                >
                  <img src={this.state.creator.avatar} />
                  {creatorName}
                </Label>
              </p>
              <p><strong><FormattedMessage id='votes' />: </strong>
                <Icon 
                  name='arrow up' 
                  onClick={this.handleUpvote} 
                  style={{ color: this.state.upvoteColor, marginRight: "0.8%" }} 
                />
                {this.state.upvotes - this.state.downvotes}  
                <Icon 
                  name='arrow down' 
                  onClick={this.handleDownvote} 
                  style={{ color: this.state.downvoteColor, marginLeft: "1%" }} 
                />
              </p>
              <Button secondary fluid>
                <Link 
                  style={{ color: "white" }} 
                  to={`/occurrences/${this.state.idOccurrence}`}
                >
                  <FormattedMessage id='back.occurrence' />
                </Link>
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
};

export default Solutions;