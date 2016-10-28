import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Feed from './feed';
import {Tabs, Tab} from 'material-ui/Tabs';
import ActionHome from 'material-ui/svg-icons/action/home';
import {red500} from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = (
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <div>
      <AppBar title="RSS Offline Reader"
        iconElementRight={<ActionHome color={red500}/>}
        />
      <Tabs>
        <Tab label="Feed">
          <Feed />
        </Tab>
        <Tab label="RSS Sources">
          <div>
            Got here!
          </div>
        </Tab>
      </Tabs>
    </div>
  </MuiThemeProvider>
);

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('entry');
  if (root) { render(App, root) }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
});
