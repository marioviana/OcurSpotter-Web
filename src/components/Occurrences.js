import React, { Component } from 'react';
import { Container, Label, Button, Grid, Icon, Header, Image, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-spinkit';
import axios from 'axios';
import colorType from '../utils/utils';
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

class Occurrences extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      id: this.props.match.params.id,
      upvoteColor: "grey",
      downvoteColor: "grey",
      loading: true,
      upvoteExists: false
    };
    this.handleDownvote = this.handleDownvote.bind(this);
    this.handleUpvote = this.handleUpvote.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5050/occurrences/' + this.state.id)
      .then( (response) => {
        this.setState({
          loading: false,
          downvotes: response.data.downvotes,
          lat: response.data.latitude,
          lng: response.data.longitude,
          openDate: response.data.openDate,
          title: response.data.title,
          type: response.data.type.name,
          upvotes: response.data.upvotes,
          description: response.data.description,
          status: response.data.status,      
          image: response.data.image,
          creator: response.data.user,
          solution: response.data.solution
        });
      })
      .catch( (error) => {
        console.log(error);
      });
    axios.get('http://localhost:5050/occurrenceVotes/pair', {
      params: {
        user: localStorage.getItem('user_id'),
        occurrence: this.state.id
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
      axios.post('http://localhost:5050/occurrenceVotes/new', 
        stringify({
          user: localStorage.getItem('user_id'),
          occurrence: this.state.id,
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
      axios.post('http://localhost:5050/occurrenceVotes/new', 
        stringify({
          user: localStorage.getItem('user_id'),
          occurrence: this.state.id,
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
    let solutions = [];
    if (this.state.solution) {
      for (let i = 0; i < this.state.solution.length; i++) {
        solutions.push(
          <Card 
            key={i} 
            style={{ width: "100%" }}
          >
            <Card.Content>
              <Card.Header>
                <Image 
                  avatar 
                  src={this.state.solution[i].user.avatar} 
                  style={{ fontSize: '12px' }} 
                />
                {`${this.state.solution[i].user.firstName} ${this.state.solution[i].user.lastName}`}
                <small style={{ float: 'right', color: 'grey' }}>
                  <FormattedMessage id='value' />: {this.state.solution[i].value}$
                </small>
              </Card.Header>
              <Card.Meta>
                <Link 
                  to={{ 
                    pathname: `/solutions/${this.state.solution[i].id}`, 
                    state: { occId: this.state.id, occTitle: this.state.title,  occImage: this.state.image } 
                  }}
                >
                  <FormattedMessage id='see.more' />
                </Link>
              </Card.Meta>
              <Card.Description>
                {this.state.solution[i].description}
              </Card.Description>
            </Card.Content>
          </Card>
        );
      }
    }
    let color = colorType(this.state.type);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      openDate = this.state.openDate ? new Date(this.state.openDate).toLocaleDateString('en-US', options) : '',
      name = this.state.creator ? `${this.state.creator.firstName} ${this.state.creator.lastName}` : '';
    return (
      <Container>
        <Grid centered>
          <Header as='h1'>{this.state.title}</Header>
        </Grid>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={10}>
              <Image 
                rounded 
                src={this.state.image} 
              /><br/>
              <Header as='h3'><FormattedMessage id='details' /></Header>
              <p>
                <strong><FormattedMessage id='type' />: </strong>
                <Label 
                  color={color} 
                  horizontal
                >
                  {this.state.type}
                </Label>
              </p>
              <p>
                <strong><FormattedMessage id='description' />: </strong>
                {this.state.description}
              </p>
              <p>
                <strong><FormattedMessage id='open.date' />: </strong>
                {openDate}
              </p>          
              <p><strong><FormattedMessage id='creator' />: </strong>
                <Label 
                  as='a' 
                  image 
                  style={{ backgroundColor: 'white' }}
                >
                  <img src={this.state.creator.avatar} />
                  {name}
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
              <Header as='h3'><FormattedMessage id='solutions' /></Header>
              {solutions.length === 0 ? <p><FormattedMessage id='no.solutions' /></p> : solutions}
              <Button primary fluid>
                <Link 
                  style={{ color: "white" }} 
                  to={`/solution/${this.state.id}`}
                >
                  <FormattedMessage id='add.solution' />
                </Link>
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
};

export default Occurrences;
