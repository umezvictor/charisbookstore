import {API} from '../config';//returns our api url set in .env file

// fetch products to display in home page
// this file is used in Home.js
// sortBY parameter = sold or createdAt
export const getProducts = (sortBy) => {
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}


// fetch categories from backend

export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// fetch products based on  filters
// this method takes in the filter parameters as arguments and then returns products that match
// the argument filters represents the array of category ids and price range
// filters argumemt is set to empty object default
// used in Shop.js
export const getFilteredProducts = (skip, limit, filters = {}) => {
    // skip, limit and filters will be sent as parameter to json.stringify
    // hence, save them to one location
    const data = {skip, limit, filters};
    
    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}