import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';

// import { Container } from './styles';

export default function Profile() {
  const route = useRoute();
  const github_username = route.params.github_username;
  return <WebView source={{ uri: `http://github.com/${github_username}` }} style={{ flex: 1 }} />;
}
