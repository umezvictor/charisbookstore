//wors like userroute.js// shows adminroutes
//the only differnce is it checks further if user role = 1
import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';//see react-router-dom documentation for how to create private routes
import {isAuthenticated} from './index';
//...rest means rest of the props, i.e bring in resr of the props
const AdminRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => isAuthenticated() && isAuthenticated().user.role === 1 ? (
        <Component {...props}/>
    ) : (
        <Redirect  
            to={{
                pathname: "/signin",
                state: { from: props.location }
            }}
        />
    )} />
);

export default AdminRoute;
