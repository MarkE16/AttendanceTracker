type ExtendedErrorOptions = ErrorOptions & { code?: number; };

/* A simple wrapper class to include the status code. */
export class ExtendedError extends Error {
  code: number;
  
  constructor(
    message: string,
    options: ExtendedErrorOptions = {},
  ) {
    super(message, options);
    this.name = "ExtendedError";
    this.code = options.code || 500; // Default to 500 if no code is provided
    
    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, ExtendedError.prototype);
  }
}
