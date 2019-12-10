//copy all api related methods into this file -- refactoring
import {API} from '../config';//returns our api url set in .env file

//signup method performs the api interaction to signup a new user
//user is the object containing name, email and password in submitForm function

// method to create product
export const createCategory = (userId, token, category) => {
        //use return, else will show an error. the promise wont be available and you can't use .then
    return fetch(`${API}/category/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)//user has to be sent to backend in json format
        })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const createProduct = (userId, token, product) => {
    return fetch(`${API}/product/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


// fetch categories from backend
// this will be ussed to populate the category select field in add product form
export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}