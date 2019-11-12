import React, {Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';//makaes props available to other nested components
import {signout, isAuthenticated} from '../auth';//auth/index.js  method to signout user
//withRouter to access props history
//!isAuthenticated() &&  means
//isAuthenticated()  this function is invoked
//&& means -- the code after it executes only if the condition before it --!isAuthenticated()  -- is met
//shows signout link if user is authenticated
//shows signup and signin link if user is not authenticated

//set background color for active links
const isActive = (history, path) => {
    //history is the browser history eg http://localhost:3000/signup -- signup here is the history, though its part of the url
    //path is signup
    //check if they match, i.e signup -> signup
    if(history.location.pathname === path){
        return {color: '#ff9900'};
    }else{
        return {color: '#ffffff'};
    }
};
//style={isActive(history, '/')} the path is home page
//style={isActive(history, '/signin') path is signin
//the history comes as a prop from withRouter
//its accessible by destructuring or calling it via props.history 
const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link>
            </li>

            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/user/dashboard')} to="/user/dashboard">Dashboard</Link>
            </li>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/admin/dashboard')} to="/admin/dashboard">Dashboard</Link>
            </li>
            )}

            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">Signin</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">Signup</Link>
            </li>
                </Fragment>
            )}
           {isAuthenticated() && (
                <li className="nav-item">
                <span className="nav-link" style={{cursor: "pointer", color: "#fff"}} 
                onClick={() => signout(() => {
                    //redirect user to home page
                    history.push("/");
                })}>
                    Signout
                    </span>
            </li>
           )}
        </ul>
    </div>
);

export default withRouter(Menu);//withRouter gives access to props from react-router-dom
