import { verifyToken } from "./jwt";
import { getTokenFromRequest, errorResponse } from "./apiHelpers";

export const authenticate = (request) => {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return { error: errorResponse("No token provided", 401) };

    const user = verifyToken(token);
    return { user };
  } catch {
    return { error: errorResponse("Invalid token", 401) };
  }
};

