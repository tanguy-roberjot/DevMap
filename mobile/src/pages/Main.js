import React, { useEffect, useState } from 'react';
import { Alert, Image, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { getCurrentPositionAsync } from 'expo-location';
import { askAsync, LOCATION } from 'expo-permissions';
import { MaterialIcons } from '@expo/vector-icons'
import api from '../service/api';
import { connect, disconnect, subscribeToNewDev } from '../service/socket';


export default function Main() {
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');
  const [currentRegion, setCurrentRegion] = useState(null);
  const navigation = useNavigation();

  useEffect(()=>{
    async function loadInitialPosition(){
      let { status } = await askAsync(LOCATION);
      
      if (status === 'granted') {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        })
      }
    }

    loadInitialPosition();
  },[]);

  useEffect(() => {
    subscribeToNewDev(dev => {
      setDevs([...devs, dev]);
      console.log('message');
    });
  },[devs]);

  async function handleRegionChange(region){
    setCurrentRegion(region);
  }

  function setupWebSocket(){
    disconnect();
    const { latitude, longitude } = currentRegion;
    connect(latitude, longitude, techs);
  }

  async function loadDevs(){
    const { latitude, longitude } = currentRegion;
    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
    });
    console.log(response.data.devs);
    setDevs(response.data.devs);
    setupWebSocket();
  }

  if(!currentRegion){
    return null;
  }
  return (
    <>
      <MapView 
        onRegionChangeComplete={handleRegionChange} 
        initialRegion={currentRegion} 
        style={styles.mapStyle}
      >
        {devs.map(dev => (
          <Marker key={dev._id} coordinate={{ 
            latitude: dev.location.coordinates[1],
            longitude: dev.location.coordinates[0]}}
          >
          <Image style={styles.avatar} source={{ uri : dev.avatar_url}}/>
          <Callout onPress={() => navigation.navigate('Profile', {
            github_username: dev.github_username
          })}>
            <View style={styles.callout}>
              <Text style={styles.devName}>{dev.name}</Text>
              <Text style={styles.devBio}>{dev.bio}</Text>
              <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
            </View>
          </Callout>
        </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search devs by techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={() => {loadDevs()}} style={styles.searchButton}>
          <MaterialIcons name="my-location" size={20} color="#fff"/>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff',
    resizeMode: 'contain'
  },
  callout: {
    width: 260,
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16,    
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    color: '#333',
    borderRadius: 25,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  }

});
