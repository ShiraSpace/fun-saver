import { StatusCodes } from 'http-status-codes';
import { API_ERRORS } from './constants';

function errorResponse(error: string, status: StatusCodes): Response {
  return Response.json({ error }, { status });
}

export function badRequest(error: string): Response {
  return errorResponse(error, StatusCodes.BAD_REQUEST);
}

export function notSignedIn(): Response {
  return errorResponse(API_ERRORS.notSignedIn, StatusCodes.UNAUTHORIZED);
}

export function notYourAccount(): Response {
  return errorResponse(API_ERRORS.notYourAccount, StatusCodes.FORBIDDEN);
}

export function accountNotFound(): Response {
  return errorResponse(API_ERRORS.accountNotFound, StatusCodes.NOT_FOUND);
}
