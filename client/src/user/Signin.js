import React, {useState} from 'react';//used useState from react hooks
import {Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
//import {signup} from '../auth/index'
import {signin, authenticate, isAuthenticated} from '../auth';//interacts with backend api methods
const Signin = () => {

    //create state to hold user input
    //values is the name of the state
    //setValues is the method to update it
    const [values, setValues] = useState({
        email: 'victorblaze2010@gmail.com',
        password: '123456',
        error: '',
        loading: false, //spinner to show when signin is hapening
        redirectToReferrer: false//changes to true when user is directed
    })

    //grab values with destructuring
    const {email, password, error, loading, redirectToReferrer} = values; //helpful in submitform function

    //grab user info (role specifically )from isAuthenticated method and redirect to admin or user dashboard based on role value
    //role: 1=admin, 0=ordinary user
    const {user} = isAuthenticated(); 
    //create a handle change whenever input changes, grab values and update the state
    //used a higher order function, i.e fn that returns another fn
    //takes in name and event 
    const handleChange = name => event => {
        //[name] reps any of the fields, name, email, password
        setValues({...values, error: false, [name]: event.target.value });
    };

    
    //e is same as event
    //submit form -- send data to backend
    const submitForm = (e) => {
        e.preventDefault();
        //set previous errors to false
        setValues({...values, error: false, loading: true});
        //call signup method
        signin({email, password})
            .then(data => {
                //if error field is populated in the json response
               // console.log(data)//shows all the user fields from model in backend
               //data.error does not come from this user info above, its from signupvalidator middleware
               //i mean this  return res.status(400).json({ error: firstError });
               //its passed on to signup api route
                if(data.error){
                   
                    //set the error in the state to the error gotten from backend
                    setValues({...values, error: data.error, loading: false})
                }else{
                    //call the authencicate middleware in auth/index.js 
                    //it saves user info (token and info) in localstorage and moves to the callback
                   authenticate(data, () => {
                       // middleware in authenticate method in auth/index.js
                       //update the state by set redirectToReferrer to true
                       setValues({
                        ...values,
                        redirectToReferrer: true// will be used as a precondition for redirecting user
                    });

                });
            }
        });
        //same as signup({name: name, email: email, password: password});
       //this object has to be converted to json string
       //it is received as a single input called 'user' in the signup function
       
    };
    //create SignupForm as a function and execute it in the layout
    const SigninForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" value={email} className="form-control"/>
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" value={password} className="form-control"/>
            </div>

            <button onClick={submitForm} className="btn btn-primary">
                Signin
            </button>
        </form>
    );

    //show error message to user if error is set in the state
    const showError = () => (
        //displays only if error is set in the state 
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
        {error}
        </div>
    );

    
    //show loading ..., you can use a spinner here 
    //shows only when loading is true, i.e when user just clicks on signin button
    const showLoading = () => 
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    //redirect user
    const redirectUser = () => {
        //use the Redirecct component that comes with react
        //if redirectTorefferer is true - then redirect
        if(redirectToReferrer){
           //redirect to admin dashboard if role = 1
           if(user && user.role === 1){
            return <Redirect to="/admin/dashboard" />
           }else{
               //if not admin, redirect to normal users dashboard
               return <Redirect to="/user/dashboard" />
           }
        }

         //redirect user if logged in -- redirect to home page
         if(isAuthenticated()){
            return <Redirect to="/" />
           }
    };

    return (
        <Layout title="Signin Page" description="Login to your account" className="container col-md-8 offset-md-2">
            {showError()}
            {showLoading()}
            {SigninForm()}
            {redirectUser()}
        </Layout>
    )
};


export default Signin;