import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Label, Button, Grid, Icon, Header, Image, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-spinkit';
import axios from 'axios';

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
          suggestion: response.data.suggestion,
          title: response.data.title,
          type: response.data.type.name,
          upvotes: response.data.upvotes,
          description: response.data.description,
          status: response.data.status,
          closeDate: response.data.closeDate,      
          image: response.data.image,
          creator: response.data.user,
          solution: response.data.solution
        });
      })
      .catch( (error) => {
        console.log(error);
      });
    axios.get('http://localhost:5050/occurrenceVotes/pair?user=' + 
      localStorage.getItem('user_id') +
      '&occurrence=' + this.state.id
    )
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
    if (this.state.upvoteColor !== 'blue') {
      axios.post('http://localhost:5050/occurrenceVotes/new?user=' +
        localStorage.getItem('user_id') +
        '&occurrence=' + this.state.id +
        '&vote=' + true +
        '&exists=' + this.state.upvoteExists
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
    if (this.state.downvoteColor !== 'red') {
      axios.post('http://localhost:5050/occurrenceVotes/new?user=' +
        localStorage.getItem('user_id') +
        '&occurrence=' + this.state.id +
        '&vote=' + false +
        '&exists=' + this.state.upvoteExists
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
    localStorage.setItem('reload', 'NULL');
    if (this.state.loading) {
      return <center><Spinner name="ball-scale-ripple" style={{ marginTop: "25%" }}/></center>;
    } 
    let solutions = [];
    let path = "/solutions/" + this.state.id;
    if (this.state.solution) {
      for (let i = 0; i < this.state.solution.length; i++) {
        solutions.push(
          <Card key={i} style={{ width: "100%" }}>
            <Card.Content>
              <Card.Header>
                <Image style={{ fontSize: '12px' }}src={this.state.solution[i].user.avatar} avatar />
                {this.state.solution[i].user.firstName + " " + this.state.solution[i].user.lastName}
                <small style={{ float: 'right', color: 'grey' }}>Value: {this.state.solution[i].value}$</small>
              </Card.Header>
              <Card.Meta>
                <Link 
                  to={{ pathname: "/solutions/" + this.state.solution[i].id, 
                    state: { occId: this.state.id, occTitle: this.state.title,  occImage: this.state.image} }}>
                    See more
                </Link>
              </Card.Meta>
              <Card.Description>{this.state.solution[i].description}</Card.Description>
            </Card.Content>
          </Card>
        );
      }
    }
    let color = "grey";
    switch (this.state.type) {
      case "Animals":
        color = "blue";
        break;
      case "Roads and Signs":
        color = "red";
        break;
      case "Lightning and Energy":
        color = "orange";
        break;
      case "Gardens and Environment":
        color = "green";
        break;
      case "Forest":
        color = "purple";
        break;
      case "Cleansing and conservation":
        color = "pink";
        break;
      case "Pavement and Sidewalks":
        color = "brown";
        break;
      case "Waters and Sewers":
        color = "olive";
        break;
      case "Garbage collection":
        color = "yellow";
        break;
      case "Vehicles":
        color = "teal";
        break;
      case "Suggestion":
        color = "violet";
        break;
      default:
        color = "grey";
        break;
    }
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let openDate = this.state.openDate ? new Date(this.state.openDate).toLocaleDateString('en-US', options) : '';
    let name = this.state.creator ? this.state.creator.firstName + " " + this.state.creator.lastName : '';
    return (
      <Container>
        <Grid centered>
          <Header as='h1'>{this.state.title}</Header>
        </Grid>
        <Grid centered><Grid.Row><Grid.Column width={10}>
          <Image src={this.state.image} rounded /><p></p>
          <Header as='h3'>Details</Header>
          <p><strong>Type: </strong><Label color={color} horizontal>{this.state.type}</Label></p>
          <p><strong>Description: </strong>{this.state.description}</p>
          <p><strong>Open date: </strong>{openDate}</p>          
          <p><strong>Creator: </strong>
            <Label as='a' image style={{ backgroundColor: 'white' }}>
              <img src={this.state.creator.avatar} />
              {name}
            </Label>
          </p>
          <p><strong>Votes: </strong>
            <Icon onClick={this.handleUpvote} style={{ color: this.state.upvoteColor, marginRight: "0.8%" }} name='arrow up' />
            {this.state.upvotes - this.state.downvotes}  
            <Icon onClick={this.handleDownvote} style={{ color: this.state.downvoteColor, marginLeft: "1%" }} name='arrow down' /></p>
            <Header as='h3'>Solutions</Header>
          {solutions}
          <Button primary fluid><Link to={"/solution/" + this.state.id} style={{ color: "white" }}>Add solution</Link></Button>
        </Grid.Column></Grid.Row></Grid>
      </Container>
    );
  }
};

export default Occurrences;
