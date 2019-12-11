// here, we list the categories in checkbox
import React, {useState, useEffect} from 'react';

// this Checkbox component is a child component to Shop component
// the array of categori ids it returns has to be sent to the Shop (parent) component

// takes in destructured categories as prop in Shop component
// when you select a checkbox, it send a request to backednd and displays products on the 
// right side of the page based on categories clicked
// handleFilters is passed as a prop here
// it references handleFilters method in Shop parent component
const Checkbox = ({categories, handleFilters}) => { 

    // state to hold categories checked via checkbox
    const [checked, setChecked] = useState([]); 

    // method to get products based on checked categories
    const handleToggle = c => () => {
        // check if current checked id is in state, return the index or -1 if false
        const currentCategoryId = checked.indexOf(c);
        const newCheckedCategoryId = [...checked]; // array of checked ids

        // if currently checked category is not already in state, push it into it, else take it off
        if(currentCategoryId === -1){
            newCheckedCategoryId.push(c);
        }else{
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }

        // update state with category ids
        setChecked(newCheckedCategoryId);

        // pass the category ids array to handleFilters prop
        // that way it becomes available when we use checkbox component in Shop component
        handleFilters(newCheckedCategoryId);//send array of category ids to parent component
    }


    return categories.map((c, i) => (
        <li key={i} className="list-unstyled">
            <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type="checkbox" className="form-check-input" />
            <label className="form-check-label">{c.name}</label>
        </li>
    ))
};

export default Checkbox;