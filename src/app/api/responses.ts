import { StatusCodes } from 'http-status-codes';

function errorResponse(error: string, status: StatusCodes): Response {
  return Response.json({ error }, { status });
}

export function badRequest(error: string): Response {
  return errorResponse(error, StatusCodes.BAD_REQUEST);
}

export function notSignedIn(): Response {
  return errorResponse('not signed in', StatusCodes.UNAUTHORIZED);
}

export function notYourAccount(): Response {
  return errorResponse('not your account', StatusCodes.FORBIDDEN);
}

export function accountNotFound(): Response {
  return errorResponse('account not found', StatusCodes.NOT_FOUND);
}
