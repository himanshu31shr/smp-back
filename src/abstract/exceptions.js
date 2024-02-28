/**
 * Exception handler for validation errors
 */
class ValidationError extends Error {
  constructor(message) {

    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = 'Validator Error';

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = 422;
  }
}

class ConfigError extends Error {
  constructor(message) {

    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = 'Configuration Error';

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = 422;

  }
}

class NoAccess extends Error {
  constructor(message) {

    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = 'Not Authorized';

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = 401;
  }
}

module.exports = {
  NoAccess,
  ValidationError,
  ConfigError
}