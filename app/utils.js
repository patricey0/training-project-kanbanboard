exports.catchError = (error, res) => {
    console.error(error);
    res.status(500).json({error: error.message});  
}

/*
const catchError = () => {

}

module.exports = catchError;*/