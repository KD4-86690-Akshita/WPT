function createErrorResult(error)
{
    return{status:'error',error}
}

function createSuccessResult(error)
{
    return{status:'success',error}
}

function createResult(error,data)
{
    return error ? createErrorResult(error):createSuccessResult(data)
}

module.exports={
    createResult,
    createSuccessResult,
    createErrorResult,
}