
const successResponse = (res, message, data = {}, statusCode) => {
    return res.status(statusCode || 200).json({
        statusCode: statusCode || 200,
        status: 'success',
        message,
        data
    });
}

const errorResponse = (res, message, error ={}, statusCode) => {
    return res.status(statusCode || 500).json({
        statusCode: statusCode || 500,
        status: 'error',
        message,
        error
    })
}

export {
    successResponse, 
    errorResponse
}