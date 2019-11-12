//copy all api related methods into this file -- refactoring
import {API} from '../config';//returns our api url set in .env file

//signup method performs the api interaction to signup a new user
//user is the object containing name, email and password in submitForm function

export const signup = (user) => {
        //use return, else will show an error. the promise wont be available and you can't use .then
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)//user has to be sent to backend in json format
        })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

//signin user -- user object contains email and password
export const signin = (user) => {
    //use return, else will show an error. the promise wont be available and you can't use .then
return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify(user)//user has to be sent to backend in json format
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

//save token to localstorage   -- and redirect user in the middleware -next() -- the callback
//you can do anything within the callback
//data is the user data, next is the call back  which redirects user
//both arguments will be passed in when signin method is called in the Signin component
export const authenticate = (data, next) => {
    //check if window object exists, then save to local storage
    if(typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
};


export const signout = (next) => {
    //remove token from local storage
    if(typeof window !== "undefined") {
        localStorage.removeItem("jwt");
        next();

          //make request to backend to log user out
          return fetch(`${API}/signout`, {
              method: "GET"
          })
          .then(response => {
              console.log("Signout", response);
          })
          .catch(err => console.log(err));
    }
   //redirect user  - in the callback -- next. i.e where thus method is called in the navigation menu
};


//this method checks if user is authenticated  -- returns jwt (user info) or false
//remember -- jwt has token and user information
//the user info is used to conditionally show nav links such as signin, signout, signup
export const isAuthenticated = () => {
    //check if window object exists
    if(typeof window == 'undefined'){
        return false;
    }
    //check for jwt in local storage 
    if(localStorage.getItem("jwt")){
        //return jwt, but in object format
        return JSON.parse(localStorage.getItem("jwt"));
    }else{
        //if no jwt found - return false
        return false;
    }
};