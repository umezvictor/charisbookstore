import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import Card from './Card';
import { getCategories, getFilteredProducts } from './apiCore';
import Checkbox from './Checkbox';
import { prices } from './fixedPrices'; // array of price range
import Radiobox from './Radiobox';

// <Checkbox categories={categories} />  set the categories prop tho the one in the state
// here, we show categories in the left
const Shop = () => {

    // state to hold filters 
    // category holds the array of category ids 
    // price holds abn array of price ranges
    // myFilters is the name of the state
    // setMyFilters is the function to update the state
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: []}
    });
    // state for categories
    const [categories, setCategories] = useState([]);

    // state for error
    const [error, setError] = useState(false);
    // state for limit and skip parameters which will be sent to backend to make api request for products
    // based on filter parameters
    const [limit, setLimit] = useState(6); // default limit of items to be returned is 6
    const [skip, setSkip] = useState(0);
    // state for filtered results
    const [filteredResults, setFilteredResults] = useState(0);



     // load categories and set form data
    const init = () => {
        // execute getCategories method
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



    /**
     {filteredResults.data.map((product, i) => (
                                    <Card key={i} product={product}/>
                                ))}
     */
    // this method returns products based on filtered results and saves the data in the state as filteredResults
    // when products are returned based on filter parameters
    // use the returned data
    // whennthis loadFilteredResults function executes, it takes in newFilters, 
    // which is supplied from handleFilters method 
    // the out
    // takes newFilters as parameter when the loadFilteredResults 
    // function is called when the component mounts using the useEffect hook
    const loadFilteredResults = newFilters => {
        //console.log(newFilters)
        // run the getFilteredproducts method
        // takes in 3 parameters, skip, limit and filters, which is gotten from handlefilters method
        getFilteredProducts(skip, limit, newFilters).then(data => {
            // check if error exists
            if(data.error){
                setError(data.error)
            }else{
                // update the filteredResults state with the returned data
                setFilteredResults(data.data);
            }
        })
    };



    // run init function when component mounts
    useEffect(() => {
        // call the init method
        init();
        // execute the loadFilteresResults method once component mounts
        // displays products on the right hand side of the Shop page 
        loadFilteredResults(skip, limit, myFilters.filters);
    }, [])


    // handleFilters={handleFilters(filters, 'category')} 
    // this method is passed as prop to Chechbox component
    // returns the array of category ids gotten from Checkbox component
    const handleFilters = (filters, filterBy) => {
        // filterBy = category or price
        // create newFilters object and add myfilters object from the state to it
        const newFilters = {...myFilters};
        
        // access the filters property within the myFilters property
       // filterBy = category pr price
        newFilters.filters[filterBy] = filters; // i.e filters: { category: [], price: []}
        // update filter state
        

        // check if filterBy === price, grab the price valiues
        if(filterBy === "price"){
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }

        // load filteredresults, send the categories and price filtered to the backend to fetch products
        // the result is passed to card component as prop and rendered in shop component
        loadFilteredResults(myFilters.filters);
        
        //update myFilters state
        setMyFilters(newFilters);
    };

    // method to get price values array from fixedprices.js
    const handlePrice = value => {
        // get the price gotten from import { prices } from './fixedPrices';
        const data = prices;
        // init an empty array to hold values
        let array = [];
        
        // loop through data (which is an object) and check if the id sent from the radiobox matches 
        // what is gotten from the prices array
        for(let key in data){
            if(data[key]._id === parseInt(value)){
                // set the valuesArray to the array field in the prices array of objects in fixedPrices.js
                array = data[key.array];// returns the price range arrayy eg [10, 19]
            }
        }
        return array;
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
                        <div className="col-8">
                            
                            <h2 className="mb-4">Products</h2>
                            <div className="row">
                                {JSON.stringify(filteredResults)}
                                
                            </div>
                        </div>
            </div>
    
        </Layout>
    )
    
};


export default Shop;