//this file will be used by many other pages
//it has props that can be accessed anywhere
//these are the props with some default values 
//{title = "Title", desription = "Description", children
//children referes to the content for each page
import React from 'react';
import Menu from './Menu';
import "../styles.css";

//layout can receive props
const Layout = ({title = "Title", description = "Description", className, children}) => (
    <div>
        <Menu />
        <div className="jumbotron">
            <h2>{title}</h2>
            <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
    </div>
);

export default Layout;