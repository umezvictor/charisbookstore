import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';//BrowserRouter makes props available to other nested components
//we can grab route parameters
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home';
//user dashboard component works with the prvateroute agent -- can't show it directly
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
//privateRoute component checks if a user is logged in and returns a particular
//and return the component if user is loggged in
//redirects to login page if not
//the advantage is that it can be reused for any other component you want to restrict to logged in user

//nb, this Routes component returns the entire component
//use to to replace the default App component in index.js
const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />
            </Switch>
            <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
            <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
        </BrowserRouter>
    );
};


export default Routes;