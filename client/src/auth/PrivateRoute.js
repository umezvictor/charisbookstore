//create a private Route
//controls access to the private routes, such as user dshboard
//redirects to dashbors if logged or login page if not
//i authenticated shows the component and take in the props


//privateRoute component checks if a user is logged in and returns a particular
//and return the component if user is loggged in
//redirects to login page if not

import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';//see react-router-dom documentation for how to create private routes
import {isAuthenticated} from './index';
//...rest means rest of the props, i.e bring in resr of the props
const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => isAuthenticated() ? (
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

export default PrivateRoute
