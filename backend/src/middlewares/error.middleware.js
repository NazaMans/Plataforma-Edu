export const errorHandler = (err, req, res, next) => {

    const estadoError = err.status || err.statusCode || 500;

    const message = estadoError < 500 ? err.message : "Error interno del servidor";

    res.status(estadoError).json({
        success: false,
        message: message
    });

}