import React from 'react';
import {API} from '../config';

// item and url will ba passed in as prop
// item and url have been destructured here

// it is used in Card component, the product is fetched from home.js and passed to any referenced component as a prop
const ShowImage = ({ item, url }) => (
    <div className="product-img">
        <img src={`${API}/${url}/photo/${item._id}`} alt={item.name} className="mb-3" style={{maxHeight: "100%", maxWidth: "100%" }} />
    </div>
)

export default ShowImage;