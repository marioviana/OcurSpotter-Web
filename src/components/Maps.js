import React, { Component } from 'react';
import { Card, Label } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Control from 'react-leaflet-control';
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

class Maps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      latitude: 20,
      longitude: 20,
      loading: true
    };
    this.handlePosition = this.handlePosition.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5050/occurrences/map', {
      params: {
        status: 1
      }
    })
      .then( (response) => {
        let markers = [],
          icons = ['/animals.png', '/water.png', '/road.png', '/lightning.png', '/garden.png', 
            '/forest.png', '/clean.png', '/pavement.png', '/vehicles.png', '/suggestion.png', '/others.png', ];
        for (let i = 0; i < response.data.length; i++) {
          markers.push(
            { position: [ response.data[i].latitude, response.data[i].longitude ], 
              popup: `<a href="/occurrences/${response.data[i].id}">${response.data[i].title}</a>`,
              options: { 
                title: response.data[i].title, 
                icon: 
                  L.icon({
                    iconUrl: icons[response.data[i].type.id-1],
                    iconSize: [35, 40],
                    iconAnchor: [18, 20],
                  })  
              }
            }
          );
        }
        this.setState({
          markers: markers,
          loading: false
        });
      })
      .catch( (error) => {
        console.log(error);
      });
      
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.handlePosition);
    } 
  }

  handlePosition(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
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
      <Map 
        center={[this.state.latitude, this.state.longitude]} 
        className="markercluster-map" 
        maxZoom={18}
        minZoom={2} 
        style={{ marginTop: "-4%" }} 
        zoom={4}
      >
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
              <p>
                <Label 
                  color='blue' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Animals
                </Label>
              </p>
              <p>
                <Label 
                  color='red' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Waters and Sewers
                </Label>
              </p>
              <p>
                <Label 
                  color='orange' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Roads and Signs
                </Label>
              </p>
              <p>
                <Label 
                  color='green' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Lightning and Energy
                </Label>
              </p>
              <p>
                <Label 
                  color='purple' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Gardens and Environment
                </Label>
              </p>
              <p>
                <Label 
                  color='pink' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Forest
                </Label>
              </p>
              <p>
                <Label 
                  color='brown' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Cleansing and conservation
                </Label>
              </p>
              <p>
                <Label 
                  color='olive' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Pavement and Sidewalks
                </Label>
              </p>
              <p>
                <Label 
                  color='yellow' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Garbage collection
                </Label>
              </p>
              <p>
                <Label 
                  color='teal' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Vehicles
                </Label>
              </p>
              <p>
                <Label 
                  color='violet' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Suggestion
                </Label>
              </p>
              <p>
                <Label 
                  color='grey' 
                  horizontal 
                  size='small' 
                  style={{ width: '165px' }}
                >
                  Others
                </Label>
              </p>
            </Card.Content>
          </Card>
        </Control>
      </Map>
    );
  }
};

export default Maps;
