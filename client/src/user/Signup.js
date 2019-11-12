import React, {useState} from 'react';//used useState from react hooks
import {Link} from 'react-router-dom';
import Layout from '../core/Layout';
//import {signup} from '../auth/index'
import {signup} from '../auth';//interacts with api method for signing up a new user
const Signup = () => {

    //create state to hold user input
    //values is the name of the state
    //setValues is the method to update it
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    })

    //grab values with destructuring
    const {name, email, password, error, success} = values; //helpful in submitform function
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
        setValues({...values, error: false});
        //call signup method
        signup({name, email, password})
            .then(data => {
                //if error field is populated in the json response
               // console.log(data)//shows all the user fields from model in backend
               //data.error does not come from this user info above, its from signupvalidator middleware
               //i mean this  return res.status(400).json({ error: firstError });
               //its passed on to signup api route
                if(data.error){
                   
                    //set the error in the state to the error gotten from backend
                    //data.error is the error message from the backend  - called error
                    setValues({...values, error: data.error, success: false})
                }else{
                    //clear input fields if no error -- set the input fields state to empty
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        error: '',
                        success: true//will be used to show message to the user
                    })

                }
            })
        //same as signup({name: name, email: email, password: password});
       //this object has to be converted to json string
       //it is received as a single input called 'user' in the signup function
       
    };
    //create SignupForm as a function and execute it in the layout
    const SignupForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" value={name} className="form-control"/>
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" value={email} className="form-control"/>
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" value={password} className="form-control"/>
            </div>

            <button onClick={submitForm} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    //show error message to user
    const showError = () => (
        //displays only if error is set in the state 
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
        {error}
        </div>
    );

    
    //show success message to user
    const showSuccess = () => ( 
        //displays only if success is true in the state
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>
            Your account has been created, you can now <Link to="/signin">login</Link>
        </div>
    );

    return (
        <Layout title="Signup Page" description="Create an account" className="container col-md-8 offset-md-2">
            {showError()}
            {showSuccess()}
            {SignupForm()}
            
        </Layout>
    )
};


export default Signup;