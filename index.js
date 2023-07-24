/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import UsersContextPrivider from './context/UsersContext';
const MainApp = () => (
  <UsersContextPrivider>
    <App />
  </UsersContextPrivider>
);
AppRegistry.registerComponent(appName, () => MainApp);
