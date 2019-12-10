import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getProducts} from './apiCore';
import Card from './Card'; // loop throught the product and display the products
/*
we loop through the products returned from productsBySell method and then we pass the products to Card component
as a prop
 {productsBySell.map((product, i) => (
                <Card key={i} product={product} />
            ))}
*/

const Home = () => {
    // state to hold products by sell, state is empty by default
    const [productsBySell, setProductsBySell] = useState([]);
     // state to hold products by sell, state is empty by default
    const [productsByArrival, setProductsByArrival] = useState([]);
    // state for errors
    const [error, setError] = useState(false);

    // fetch products and add to the productsBySell state, load products  by quantity sold
    // pass 'sold' as a parameter to the function
    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if(data.error){
                setError(data.error);
            }else{
                // update setProductsBySell with products
                setProductsBySell(data)
            }
        });
    }

    
    // load products by arrival
    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if(data.error){
                setError(data.error);
            }else{
                // update setProductsBySell with products
                setProductsByArrival(data)
            }
        });
    };

    // run the two functions when the component mounts or there is a state change
    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, [])

    return (
        <Layout title="Home Page" description="Online Store for Christian Books" className="container-fluid">
             <h4 className="mb-4">New Arrivals</h4>
             <div className="row">
                {productsByArrival.map((product, i) => (
                    <Card key={i} product={product} />
                ))}
            </div>


            <h4 className="mb-4">Best Sellers</h4>
            <div className="row">
                {productsBySell.map((product, i) => (
                    <Card key={i} product={product} />
                ))}
            </div>
           

           
        </Layout>
    )
    
};

export default Home;