import React, {useState, useEffect} from 'react';

// prices will be received as props from fixedPrices.js in Shop component
// handleFilters is received as props from the parent component Shop.js
    const Radiobox = ({ prices, handleFilters }) => {
    // set state to 0 by defaull
    // state to hold prices
    const [value, setValue] = useState(0);

    const handleChange = (event) => {
        // pass users choice to handlefilters prop, which calls handleFilters method in Shop.js
        // it takes two parameters as shown below
        // <Radiobox prices={prices} handleFilters={filters => handleFilters(filters, 'price')} />
        // 'price' is hardcoded, hence we pass only one parameter
        handleFilters(event.target.value);
        // update state
        setValue(event.target.value);
    }

    // loop through the prices array
    return prices.map((p, i) => (
        <div key={i}>
            <input onChange={handleChange} name={p} value={`${p._id}`} type="radio" className="mr-2 ml-4" />
            <label className="form-check-label">{p.name}</label>
        </div>
    ));

};

export default Radiobox;