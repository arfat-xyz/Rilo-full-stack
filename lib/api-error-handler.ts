import { ZodError } from "zod"; // Importing ZodError for validation error handling
import { Prisma } from "@prisma/client";
import { formatErrorResponse } from "./api-response";

/**
 * routeErrorHandler
 * Handles various error types, including validation errors, generic errors, and unknown errors.
 *
 * @param {unknown} error - The error object to handle
 * @returns {Response} - A formatted error response based on the type of error
 */
export function routeErrorHandler(error: unknown) {
  if (error instanceof ZodError) {
    // If the error is a Zod validation error
    // Extract and format each validation error message
    const validationErrors = error.errors.map((err) => err.message).join(", ");
    return formatErrorResponse(validationErrors, 422); // Return a 422 Unprocessable Entity response
  } else if (error instanceof Error) {
    // If the error is a standard JavaScript error
    return formatErrorResponse(error.message, 500); // Return a 500 Internal Server Error response with the error message
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return formatErrorResponse("Feature request conflict error.", 409);
    }
  } else {
    // If the error is of an unknown type
    return formatErrorResponse(
      "Internal server error. Please try again later",
      500
    ); // Return a generic 500 error response
  }
}
