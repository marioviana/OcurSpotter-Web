import React, { Component } from 'react';
import { Container, Header, Icon, Popup, Button, Grid, Modal, Image } from 'semantic-ui-react';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';


class Marker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      title: this.props.title,
      description: this.props.description,
      openDate: this.props.openDate,
      closeDate: this.props.closeDate,
      suggestion: this.props.suggestion === true ? "Yes" : "No",
      type: this.props.type,
      upvotes: this.props.upvotes,
      downvotes: this.props.downvotes,
      image: this.props.image,
      creatorName: this.props.creatorName,
      creatorAvatar: this.props.creatorAvatar
    }
  }

  /*componentWillMount() {
    axios.get('http://localhost:5050/occurrences/' + this.state.id)
        .then( (response) => {
          console.log(response)
          this.setState({
            openDate: response.data.openDate,
            closeDate: response.data.closeDate,
            status: response.data.status,
            creatorName: response.data.creatorName,
            creatorAvatar: response.data.creatorAvatar,
            suggestion: response.data.suggestion,
            type: response.data.type,
            upvotes: response.data.upvotes,
            downvotes: response.data.downvotes,
            image: response.data.image
          })
        })
        .catch( (error) => {
          console.log(error);
        });
  }*/

  render () {
    let path = "/occurrences/" + this.state.id;
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
    return (
      <Popup
        trigger={<Icon name='map pin' style={{ color: color, fontSize: "20px" }} />}
        on='click'
        hideOnScroll>   
        <Link to={path}><Button primary>{this.state.title}</Button></Link>
      </Popup>
    );
  }
};

export default Marker;
