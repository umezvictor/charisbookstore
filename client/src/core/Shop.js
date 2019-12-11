import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getCategories} from './apiCore';
import Checkbox from './Checkbox';
import { prices } from './fixedPrices'; // array of price range
import Radiobox from './Radiobox';

// <Checkbox categories={categories} />  set the categories prop tho the one in the state
// here, we show categories in the left
const Shop = () => {

    // state to hold filters 
    // category holds the array of category ids 
    // price holds abn array of price ranges
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: []}
    });
    // state for categories
    const [categories, setCategories] = useState([]);

    // state for error
    const [error, setError] = useState(false);
    // state for limit and skip parameters which will be sent to backend to make api request for products
    // based on filtr parameters
    const [limit, setLimit] = useState(6); // default limit of items to be returned
    const [skip, setSkip] = useState(0);
     // load categories and set form data
    const init = () => {
        getCategories().then(data => {
            // check if error exists
            if(data.error){
                //update state error if error exists
                setError(data.error);
            }else{
                // if no error, populate the empty categories array above with the data returned from the backed
                setCategories(data);
            }
        })
    };

    // const loadFilteredResults = newFilters => {
    //     // 2console.log(newFilters)
    // }


    // run init function when component mounts
    useEffect(() => {
        init();
    }, [])


    // handleFilters={handleFilters(filters, 'category')} 
    // this methis is passed as prop to Chechbox component
    // returns the array of category ids gotter from Checkbox component
    const handleFilters = (filters, filterBy) => {
        // filterBy = category or price
        // grab myfilters object from state
        const newFilters = {...myFilters};
        // access the filters property within the myFilters property
        newFilters.filters[filterBy] = filters;
        // update filter state
        

        // check if filterBy === price, grab the prive valiues
        if(filterBy === 'price'){
            let priceValues = handlePrice(filters);
            newFilters.filter[filterBy] = priceValues;
        }

        setMyFilters(newFilters);
    };

    // methiod tp get price values array from fixedprices.js
    const handlePrice = value => {
        // get the price gotten from import { prices } from './fixedPrices';
        const data = prices;
        // init an empty array to hold values
        let valuesArray = [];
        
        // loop through data (which is an object) and check if the id sent from the radiobox matches 
        // what is gotten from the prices array
        for(let key in data){
            if(data[key]._id === parseInt(value)){
                // set the valuesArray to the array field in the prices array of objects in fixedPrices.js
                valuesArray = data[key.array];// returns the price range arrayy eg [10, 19]
            }
        }
        return valuesArray;
    };


    return (
        <Layout title="Shop" description="Buy Christian books" className="container-fluid">
            
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox categories={categories} handleFilters={filters => handleFilters(filters, 'category')} />
                    </ul>

                    <h4>Filter by price range</h4>

                    <div>
                        <Radiobox prices={prices} handleFilters={filters => handleFilters(filters, 'price')} />
                    </div>
                    
                       
                    
                </div>
                        <div className="col-8">{JSON.stringify(myFilters)}</div>
            </div>
    
        </Layout>
    )
    
};


export default Shop;