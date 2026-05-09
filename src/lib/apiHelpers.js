import { NextResponse } from "next/server";

export const successResponse = (data, status = 200) =>
  NextResponse.json({ status: "success", data }, { status });

export const errorResponse = (message, status = 400) =>
  NextResponse.json({ status: "error", message }, { status });

export const getTokenFromRequest = (request ) => {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!authHeader) return null;
  return authHeader.split(" ")[1];
};
