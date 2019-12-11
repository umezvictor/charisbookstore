import React from 'react';
import {Link} from 'react-router-dom';
import ShowImage from './ShowImage';

// this component is reusable
// it only needs the product to be passed to it
// there is a curly brace around product because it is going to be received as a prop
const Card = ({ product }) => {
    return (
        <div className="col-4 mb-3">
            <div className="card">
                <div className="card-header">{product.name}</div>
                <div className="card-body">
                    <ShowImage item={product} url="product" />
                    <p>{product.description}</p>
                    <p>N{product.price}</p>
                    <Link to="/">
                        <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
                            View Product
                        </button>
                    </Link>
                    <button className="btn btn-outline-warning mt-2 mb-2">
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;