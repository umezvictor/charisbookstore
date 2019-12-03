import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import { createProduct } from './apiAdmin';
import { Link } from 'react-router-dom';

const AddProduct = () => {

    const { user, token } = isAuthenticated();

    // create state
    const [values, setvalues] = useState({
        // categories will be populated from backend
        name: '',
        description: '',
        price: '',
        categories: '',
        catgory: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '', // informs user that a new user has been created
        redirectToProfile: false,
        formData: ''
    })

    // destructure values from state
    const {
        name,
        description,
        price,
        categories,
        catgory,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

     // we want the form data available soon as component mounts, useEffect hook handles this
    useEffect(() => {
        setvalues({...values, formData: new FormData()})
    }, [])

    // method to handle user input  -- higher order functions
    const handleChange = name => event => {
        // the image is gotternn via event.target.file
        // inputs fields are gotten from event.target.values
        // dynamically determine which
        // files[0] means just the first image, no multiple uploads
        const value = name === 'photo' ? event.target.files[0] : event.target.value;

        formData.set(name, value); // name and value refers the fields and values
        // formData will be sent to backend
        // set state
        // bring in the values from the state and update it with the form input (value as above)
        setvalues({...values, [name]: value});

        // we will not send json, we shall send form data instead using form data api available in the browser
       
        // as soon as form is filled, the formdata field in the state should be populated

       

    };


    const clickSubmit = (event) => {
        event.preventDefault();
    }

    // product form
    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary"><input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" /></label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} type="text" className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="text" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} type="text" className="form-control">
                    <option value="0">NO</option>
                    <option value="1">Yes</option>
                </select>    
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange('category')} type="text" className="form-control">
                    <option value="5de669feaf2ad0309cd80ab7">You already got it</option>
                </select>    
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
            </div>

            <button className="btn btn-outline-primary">Create Product</button>

        </form>
    );


    return (
        <Layout title="Add a new category" description={`Welcome ${user.name}, Add a new product `}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                   {newPostForm()}
                </div>
                
            </div>
        </Layout>
    );
};

export default AddProduct;