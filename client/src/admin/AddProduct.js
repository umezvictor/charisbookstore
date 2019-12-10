import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import { createProduct, getCategories } from './apiAdmin';
import { Link } from 'react-router-dom';

const AddProduct = () => {

    // create state
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],  // categories will be populated from backend
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '', // informs user that a new user has been created
        redirectToProfile: false,
        formData: ''
    })

    // destructure user info from isAtuthenticated
    const { user, token } = isAuthenticated();
    // destructure values from state
    const { name, description, price, categories, category, shipping, quantity, loading, error, createdProduct, redirectToProfile, formData} = values;

     // we want the form data available soon as component mounts, useEffect hook handles this
     // this works like componenDidMount in class components
    

     // load categories and set form data
     const init = () => {
         getCategories().then(data => {
             // check if error exists
             if(data.error){
                 //update state error if error exists
                 setValues({...values, error: data.error})
             }else{
                 // if no error, populate the empty categories array above with the data returned from the backed
                 setValues({
                    ...values, 
                    categories: data,
                    formData: new FormData()
                })
             }
         })
     }

    useEffect(() => {
        // poupulate the categories and formdata avaiable
        init();
    }, []);

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
        setValues({ ...values, [name]: value});
    };

    
        // we will not send json, we shall send form data instead using form data api available in the browser
       
        // as soon as form is filled, the formdata field in the state should be populated

    const clickSubmit = event => {
        event.preventDefault();

        // empty errors if any
        setValues({ ...values, error: '', loading: true});

        // call createProduct method
        createProduct(user._id, token, formData)
            .then(data => {
                if(data.error){
                    // error occurs
                    setValues({ ...values, error: data.error});
                } else {
                    // redirect user or empty form fields, cos admin might want to add more than one procuct
                    // update state
                    setValues({
                            ...values,
                            name: '',
                            description: '',
                            photo: '',
                            price: '',
                            quantity: '',
                            loading: false,
                            createdProduct: data.name // name of the product created
                    });
                }
            });
    };

    // product form
    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary"><input onChange={handleChange("photo")} type="file" name="photo" accept="image/*" /></label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange("name")} type="text" name="name" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange("description")} type="text" name="description" className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange("price")} type="text" name="price" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} type="text" className="form-control" name="shipping">
                    <option>Please Select</option>
                    <option value="0">NO</option>
                    <option value="1">Yes</option>
                </select>    
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange("category")} type="text" className="form-control" name="category">
                    <option>Please Select</option>
                   {categories.map((category, index) => (
                        <option key={index} value={category._id}>{category.name}</option>
                   ))}
                </select>    
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange("quantity")} type="number" name="quantity" className="form-control" value={quantity} />
            </div>

            <button className="btn btn-outline-primary">Create Product</button>

        </form>
    );

    // show error message
    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>{error}</div>
    );

    // show success message
    const showSuccess = () => (
        <div className="alert alert-success" style={{display: createdProduct ? '' : 'none'}}>
            <h2>{`${createdProduct}`} is created!</h2>
        </div>
    );

    // show success message
    const showLoading = () => (
        loading && (<div className="alert alert-success"> <h2>Loading...</h2>
        </div>)
    );

    // back link
    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">Go back to dashboard</Link>
        </div>
    );

    return (
        <Layout title="Add a new category" description={`Welcome ${user.name}, Add a new product `}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                   {newPostForm()}
                   {goBack()}
                </div>
                
            </div>
            <br />
        </Layout>
    );
};

export default AddProduct;