import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Feed from './feed';
import {Tabs, Tab} from 'material-ui/Tabs';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = (
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <div>
      <AppBar title="RSS Offline Reader" />
      <Tabs>
        <Tab label="Feed">
          <Feed />
        </Tab>
        <Tab label="Subscribed RSS Sources">
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
});
