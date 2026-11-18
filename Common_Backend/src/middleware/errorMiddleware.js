const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    res.status(500).send({
        success: false,
        message: process.env.NODE_ENV === "production" ? "An unexpected server error occurred" : err.message,
        data: null
    });
};

module.exports = errorMiddleware;
