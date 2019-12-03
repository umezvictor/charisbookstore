import React from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';

const AdminDashboard = () => {

    //use destructuring to pull out user info from isAuthenticated
    const {user: {name, email, role}} = isAuthenticated(); // or use below
    //const {user} = isAuthenticated(); then use user.name, user.email etc to access values

    //user links
    const adminLinks = () => {
        return (
            <div className="card">
                <h3 className="card-header">Admin Links</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category">Create Category</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product">Create Product</Link>
                    </li>
                    
                </ul>
            </div>
        )
    };

    //user info -- can be ussed directly in layout as well
    const adminInfo = () => {
        return (
            <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">{role === 1 ? 'Admin User' : 'Registered User'}</li>
            </ul>
        </div>
        );
    };

   

    return (
        <Layout title="Dashboard" description={`Welcome ${name}`} className="container">
            <div className="row">
                <div className="col-3">
                    {adminLinks()}
                </div>
                <div className="col-9">
                    {adminInfo()}
                </div>
            </div>
        </Layout>
    )
};

export default AdminDashboard;