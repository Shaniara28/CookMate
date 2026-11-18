class CustomError extends Error {
    constructor(message, status = 500) {
        super(message)
        this.status = status
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super(message, 400)
    }
}

class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message, 401)
    }
}

class ForbiddenError extends CustomError {
    constructor(message) {
        super(message, 403);
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message, 404);
    }
}

module.exports = { CustomError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError }