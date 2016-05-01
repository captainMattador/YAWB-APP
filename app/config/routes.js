import React from 'react';
import Main from '../components/Main';
import Entry from '../components/Entry';
import UserProfile from '../components/UserProfile';
import Room from '../components/Room/Room';
import { Route, IndexRoute } from 'react-router';

export default (
  <Route path="/" component={Main}>
    <Route path="user-profile/" component={UserProfile} />
    <Route path="room/:number" component={Room} />
    <IndexRoute component={Entry} />
  </Route>
);
