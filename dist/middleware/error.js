export default function errorMiddleware(err, req, res, next) {
    const defaultError = {
        statusCode: err.statusCode || 500,
        message: err.message || "Good luck figuring out the error",
    };
    res.status(defaultError.statusCode).json({ message: defaultError.message });
}
