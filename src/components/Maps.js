import React, { Component } from 'react';
import { Container, Header, Icon, Button, Card, Label } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
//import GoogleMapReact from 'google-map-react';
import axios from 'axios';
//import Marker from './Marker';
import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Control from 'react-leaflet-control';
import Spinner from 'react-spinkit';

const icon1 = L.icon({
  iconUrl: 'http://simpleicon.com/wp-content/uploads/map-marker-5.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const icon2 = L.icon({
  iconUrl: 'http://simpleicon.com/wp-content/uploads/map-marker-5.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

class Maps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //occurrences: null,
      markers: null,
      latitude: 20,
      longitude: 20,
      zoom: 9
    }
  }

  componentWillMount() {
    axios.get('http://localhost:5050/occurrences/map?status=0')
      .then( (response) => {
        //let occurrences = [];
        let markers = [];
        for (let i = 0; i < response.data.length; i++) {
          /*occurrences.push(
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
            />);*/
          markers.push(
            { position: [ response.data[i].latitude, response.data[i].longitude ], 
              popup: `<a href="/occurrences/${response.data[i].id}">${response.data[i].title}</a>`,
              options: { 
                title: response.data[i].title, 
                icon: 
                  L.icon({
                    iconUrl: 'https://image.flaticon.com/icons/svg/9/9770.svg',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                  })  
              }
            }
          );
        }
        this.setState({
          //occurrences: occurrences,
          markers: markers
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

  /*handleZoomChanged (ev) {
    this.setState({ zoom: ev.zoom });
  }*/

  render () {
    localStorage.setItem('reload', 'NULL');
    if (localStorage.getItem('user_id') === "NULL") {
      this.props.history.push("/login");
    }
    if (this.state.loading) {
      return <center><Spinner name="ball-scale-ripple" style={{ marginTop: "25%" }}/></center>;
    }
    return (
      {/* <div style={{ height: '90vh', width: "100%", marginTop: "-5%" }}>
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
      </div>*/},
      <Map 
        center={[this.state.latitude, this.state.longitude]} 
        className="markercluster-map" 
        zoom={4} 
        maxZoom={18} 
        style={{ marginTop: "-4%"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup
          markers={this.state.markers}
          onMarkerClick={(marker) => console.log(marker, marker.getLatLng())}
          onClusterClick={(cluster) => console.log(cluster, cluster.getAllChildMarkers())}
          onPopupClose={(popup) => console.log(popup, popup.getContent())}
        />
        <Control position="bottomleft" >
          <Card style={{ width: "190px" }}>
            <Card.Content>
              <p><Label color='blue' size='small' horizontal style={{ width: '165px' }}>Animals</Label></p>
              <p><Label color='red' size='small' horizontal style={{ width: '165px' }}>Waters and Sewers</Label></p>
              <p><Label color='orange' size='small' horizontal style={{ width: '165px' }}>Roads and Signs</Label></p>
              <p><Label color='green' size='small' horizontal style={{ width: '165px' }}>Lightning and Energy</Label></p>
              <p><Label color='purple' size='small' horizontal style={{ width: '165px' }}>Gardens and Environment</Label></p>
              <p><Label color='pink' size='small' horizontal style={{ width: '165px' }}>Forest</Label></p>
              <p><Label color='brown' size='small' horizontal style={{ width: '165px' }}>Cleansing and conservation</Label></p>
              <p><Label color='olive' size='small' horizontal style={{ width: '165px' }}>Pavement and Sidewalks</Label></p>
              <p><Label color='yellow' size='small' horizontal style={{ width: '165px' }}>Garbage collection</Label></p>
              <p><Label color='teal' size='small' horizontal style={{ width: '165px' }}>Vehicles</Label></p>
              <p><Label color='violet' size='small' horizontal style={{ width: '165px' }}>Suggestion</Label></p>
              <p><Label color='grey' size='small' horizontal style={{ width: '165px' }}>Others</Label></p>
            </Card.Content>
          </Card>
        </Control>
      </Map>
    );
  }
};

export default Maps;
