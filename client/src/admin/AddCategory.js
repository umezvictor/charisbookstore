import React, {useState} from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import { createCategory } from './apiAdmin';
import { Link } from 'react-router-dom';


const AddCategory = () => {
   
    //state -- using hooks
    // state for name field
    const [name, setName] = useState('');
    // state for error
    const [error, setError] = useState(false);//false by default
    // state for success
    const [success, setSuccess] = useState(false);// false by default

    // destructure user and token from localstorage
    const { user, token } = isAuthenticated();

    // method to respond to user input
    const handleChange = (e) => {
        // set error to empty
        setError('');
        // set name to user input
        setName(e.target.value);
    }

    // method to submit form
    const clickSubmit = (e) => {
         e.preventDefault();
        setError('');
        setSuccess(false);
        // make request to api to create category
        // createCategory takes in userId, token, category (name in this case, since category field contains just name)
        createCategory(user._id, token, {name}).then(data => {
            if(data.error){
                // set error field in state to the returned error if error exists
                setError(true);
            }else{
                // if no error, set error to empty and success to true
                setError('');
                setSuccess(true);
            }
        })
    }

    // form for creating new category
    const newCategoryForm = () => ( 
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} autoFocus required />
            </div>
            <button className="btn btn-outline-primary">
                Create Category
            </button>
        </form>
    );

    // show success message if it is set
    const showSuccess = () => {
        if(success){
        return <h3 className="text-success">{name} is created</h3>
        }
    };

    // show error message if it is set
    // the only time an error can occur is when the name of the category is not unique
    const showError = () => {
        if(error){
        return <h3 className="text-danger">Category name should be unique</h3>
        }
    };

    // back button
    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">Go back to dashboard</Link>
        </div>
    );

    return (
        <Layout title="Add a new category" description={`Welcome ${user.name}, add a new product category`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
                
            </div>
        </Layout>
    );
};

export default AddCategory;