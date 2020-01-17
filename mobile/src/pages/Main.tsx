import React, { useEffect, useState} from 'react'
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import {MaterialIcons} from '@expo/vector-icons'

import api from '../services/api'

export default function Main({navigation}) {
  const [users, setUsers] = useState([])
  const [currentRegion, setCurrentRegion] = useState(null)
  const [techs, setTechs] = useState('')

  useEffect(() => {
    async function loadInitialPosition(){
      const { granted } = await requestPermissionsAsync()

      if(granted) {
        const {coords} = await getCurrentPositionAsync({
          enableHighAccuracy: true
        })
       const { latitude, longitude } = coords

       setCurrentRegion({
         latitude,
         longitude,
         latitudeDelta: 0.04,
         longitudeDelta: 0.04
       })
      }
    }

    loadInitialPosition()
  }, [])

  function handleRegionChange(region) {
    setCurrentRegion(region)
  }

  async function loadDevs() {
    const {latitude, longitude} = currentRegion

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
    })
    
    setUsers(response.data)
  }
  if(!currentRegion) return null

  return (
    <>
      <MapView onRegionChangeComplete={handleRegionChange} initialRegion={currentRegion} style={styles.map}>
        {users.map(user => {
          <Marker key={user._id} coordinate={{latitude: user.location.coordinates[0], longitude: user.location.coordinates[1]}}>
            <Image style={styles.avatar} source={{uri: user.avatarUrl}}/>
            <Callout onPress={() => {
              navigation.navigate('Profile', {github_username: user.githubUsername})
            }}>
              <View style={styles.callout}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio}>{user.bio}</Text>
                <Text style={styles.techs}>{user.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        })}
      </MapView>
      <View style={styles.searchForm}> 
          <TextInput 
          style={styles.searchInput}
          placeholder="Search developers by technologie"
          placeholderTextColor="#999"
          autoCapitalize='words'
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
          />
         <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#fff"/>
         </TouchableOpacity>
      </View>
    </>
  );
  }

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff'
  },
  callout: {
    width: 260
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  },
  bio: {
    color: "#666",
    marginTop: 5
  },
  techs: {
    marginTop: 5
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex:5,
    flexDirection: 'row'
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
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.2,
    elevation: 2
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4Dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
})