import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, ErrorResponse } from '../types/common.types';

export function normalizeResponse(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const originalJson = res.json;

  res.json = function ( body: unknown ): Response {
    // Error responses (4xx and 5xx)
    if ( res.statusCode >= 400 ) {
      const errorBody = body as { message?: string; code?: string; details?: unknown };
      console.log( errorBody );
      console.log( res )
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          message: errorBody.message || getDefaultErrorMessage( res.statusCode ),
          code: errorBody.code || getErrorCode( res.statusCode ),
          details: errorBody.details,
        }
      };
      return originalJson.call( this, errorResponse );
    }

    // Success responses (2xx)
    const successResponse: SuccessResponse<unknown> = {
      success: true,
      data: body,
      message: getSuccessMessage( res.statusCode )
    };

    return originalJson.call( this, successResponse );
  };

  next();
}

function getDefaultErrorMessage( statusCode: number ): string {
  switch ( statusCode ) {
    // 4xx Client Errors
    case 400:
      return 'Bad Request - The request could not be understood';
    case 401:
      return 'Unauthorized - Authentication is required';
    case 403:
      return 'Forbidden - You do not have permission to access this resource';
    case 404:
      return 'Not Found - The requested resource does not exist';
    case 405:
      return 'Method Not Allowed - The HTTP method is not supported';
    case 406:
      return 'Not Acceptable - Cannot generate response in requested format';
    case 408:
      return 'Request Timeout - The request took too long';
    case 409:
      return 'Conflict - The request conflicts with current state';
    case 410:
      return 'Gone - The resource is no longer available';
    case 422:
      return 'Unprocessable Entity - Validation failed';
    case 429:
      return 'Too Many Requests - Rate limit exceeded';

    // 5xx Server Errors
    case 500:
      return 'Internal Server Error - Something went wrong';
    case 501:
      return 'Not Implemented - The requested feature is not available';
    case 502:
      return 'Bad Gateway - Invalid response from upstream server';
    case 503:
      return 'Service Unavailable - The server is temporarily down';
    case 504:
      return 'Gateway Timeout - Upstream server took too long';

    default:
      return 'An unexpected error occurred';
  }
}

function getErrorCode( statusCode: number ): string {
  switch ( statusCode ) {
    // 4xx Client Errors
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 405:
      return 'METHOD_NOT_ALLOWED';
    case 406:
      return 'NOT_ACCEPTABLE';
    case 408:
      return 'REQUEST_TIMEOUT';
    case 409:
      return 'CONFLICT';
    case 410:
      return 'GONE';
    case 422:
      return 'VALIDATION_ERROR';
    case 429:
      return 'RATE_LIMIT_EXCEEDED';

    // 5xx Server Errors
    case 500:
      return 'INTERNAL_SERVER_ERROR';
    case 501:
      return 'NOT_IMPLEMENTED';
    case 502:
      return 'BAD_GATEWAY';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    case 504:
      return 'GATEWAY_TIMEOUT';

    default:
      return 'UNKNOWN_ERROR';
  }
}

function getSuccessMessage( statusCode: number ): string {
  switch ( statusCode ) {
    case 200:
      return 'Request processed successfully';
    case 201:
      return 'Resource created successfully';
    case 202:
      return 'Request accepted for processing';
    case 204:
      return 'Request processed successfully with no content';
    default:
      return 'Operation completed successfully';
  }
}
