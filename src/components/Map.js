import React, { Component } from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import Marker from './Marker';

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      occurrences: null,
      latitude: 41,
      longitude: -8,
      zoom: 9
    }
  }

  componentWillMount() {
    axios.get('http://localhost:5050/occurrences/map?status=0')
      .then( (response) => {
        let occurrences = [];
        for (let i = 0; i < response.data.length; i++) {
          occurrences.push(
            <Marker           
              downvotes={response.data[i].downvotes}
              id={response.data[i].id} 
              key={i} 
              lat={response.data[i].latitude} 
              lng={response.data[i].longitude} 
              openDate={response.data[i].openDate}
              suggestion={response.data[i].suggestion}
              title={response.data[i].title}
              type={response.data[i].type.name}
              upvotes={response.data[i].upvotes}
            //description={response.data[i].description}
            //status={response.data[i].status}   
            //closeDate={response.data[i].closeDate}            
            //image={response.data[i].image}   
            //creatorName={response.data[i].user.firstName + " " + response.data[i].user.lastName}
            //creatorAvatar={response.data[i].user.avatar}
            />);
        }
        this.setState({
          occurrences: occurrences,
        });
      })
      .catch( (error) => {
        console.log(error);
      });
      
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.handlePosition.bind(this));
    } 
  }

  handlePosition(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }

  handleZoomChanged (ev) {
    this.setState({ zoom: ev.zoom });
    //console.log(ev.zoom);
  }

  render () {
    localStorage.setItem('reload', 'NULL');
    if (localStorage.getItem('user_id') === "NULL") {
      this.props.history.push("/login");
    }
    return (
      <div style={{ height: '90vh', width: "100%", marginTop: "-5%" }}>
        <GoogleMapReact        
          bootstrapURLKeys={{ 
            key: 'AIzaSyAgzcXinSLPPfMZTov2URj_f-Jk99tz8lw',
            v: '3.31'
          }}
          center={{ lat: this.state.latitude, lng: this.state.longitude }}
          //onChange={this.handleZoomChanged.bind(this)}
          //onChildMouseEnter={this.onChildMouseEnter}
          //onChildMouseLeave={this.onChildMouseLeave}
          //onChildClick={this._onChildClick}
          zoom={this.state.zoom}
        >
          {this.state.occurrences}
        </GoogleMapReact>
      </div>
    )
  }
};

export default Map;
