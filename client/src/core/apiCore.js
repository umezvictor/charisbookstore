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