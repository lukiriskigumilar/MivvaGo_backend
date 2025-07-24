/**
 * Middleware to enforce 'Content-Type: application/json' for specific HTTP methods
 * Applies to POST, PUT, PATCH, DELETE
 * 
 * If the content type is not JSON, returns a 415 Unsupported Media Type error.
 */

const validateContentType = (req, res, next) => {
    const method = req.method; 
    const contentType = req.headers['content-type'];

    const methodsToCheck = ['POST', 'PUT', 'PATCH'];

    if(methodsToCheck.includes(method)){
        if(!contentType || !contentType.includes('application/json')) {
            return res.status(415).json({
                statusCode: 415,
                status: 'error',
                message: 'Unsupported Media Type. Content-Type must be application/json',
            });
        }
    }
    next();
}

export default validateContentType;