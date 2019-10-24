//method for validation
//the express validator middlware in app.js
//enables calling of these methods, check, isLength, etc


exports.userSignupValidator = (req, res, next) => {

    req.check("name", "Name is required").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 32
        });
        req.check("password", "Password is required").notEmpty()
        req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)//must contain a digit
        .withMessage("Password must comtain a digit");
            //grab errors if they exist
            const errors = req.validationErrors();
            if(errors){
                //res.send(errors);
                //loop through errors and return first one
                const firstError = errors.map(error => error.msg)[0];//removing the [0] will return the entire array
                //console.log(firstError);
                return res.status(400).json({ error: firstError });
            }
            next();
            //use next when creating a middleware move to next method or phase, else app will halt
    };
    //use in route
