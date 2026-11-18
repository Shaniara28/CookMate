const { JsonWebTokenError } = require("jsonwebtoken");
const { CustomError } = require("./customError");
const { ForeignKeyConstraintError } = require('sequelize');

function errorHandler(err, req, res, next) {
    let status = 500
    let message = 'Internal Server Error'

    if (err instanceof CustomError) {
        status = err.status
        message = err.message
    } else if (err instanceof JsonWebTokenError) {
        message = err.message
        status = 401
    } else if (err instanceof ForeignKeyConstraintError) {
        status = 400;
        message = 'Invalid reference data';
    }

    res.status(status).json({ message })
}

module.exports = errorHandler