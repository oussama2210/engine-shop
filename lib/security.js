import { auth } from "@clerk/nextjs/server";
import { apiRatelimit, uploadRatelimit, checkRateLimit } from "./rate-limit";
import { logger, logError, startTimer } from "./logger";

export function sanitizeInput(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function validateRequired(body, fields) {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === "");
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}

export const types = {
  string: (v) => typeof v === "string",
  number: (v) => typeof v === "number" && !isNaN(v),
  integer: (v) => Number.isInteger(v),
  boolean: (v) => typeof v === "boolean",
  array: (v) => Array.isArray(v),
  object: (v) => typeof v === "object" && v !== null && !Array.isArray(v),
  stringNumber: (v) => !isNaN(Number(v)),
};

export function validateTypes(body, schema) {
  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field];
    if (value === undefined || value === null) continue;
    const { type, min, max, pattern, message } = rules;
    if (type && !types[type](value)) {
      throw new Error(message || `Invalid type for ${field}: expected ${type}`);
    }
    if (min !== undefined && typeof value === "number" && value < min) {
      throw new Error(message || `${field} must be at least ${min}`);
    }
    if (max !== undefined && typeof value === "number" && value > max) {
      throw new Error(message || `${field} must be at most ${max}`);
    }
    if (typeof value === "string" && max !== undefined && value.length > max) {
      throw new Error(message || `${field} exceeds ${max} characters`);
    }
    if (typeof value === "string" && pattern && !pattern.test(value)) {
      throw new Error(message || `Invalid format for ${field}`);
    }
  }
}

export const patterns = {
  phone: /^[\d\s\-\+\(\)]{7,20}$/,
  postalCode: /^[\d\s\-a-zA-Z]{3,10}$/,
  alphanumeric: /^[a-zA-Z0-9\s\-_]+$/,
  monetary: /^\d+(\.\d{1,2})?$/,
  id: /^[a-zA-Z0-9_-]+$/,
  url: /^https?:\/\/.+/,
};

export async function requireAuth() {
  const session = await auth();
  if (!session?.userId) {
    throw new AuthError("Authentication required");
  }
  return session;
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.status = 401;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export function sanitizeError(error) {
  const message = error.message?.toLowerCase() || "";
  const sensitive = ["secret", "key", "token", "password", "credential"];
  if (sensitive.some((s) => message.includes(s))) {
    return { error: "Internal server error" };
  }
  return { error: error.message };
}

export function sanitizeErrorWithStatus(error) {
  const status = error.status || (error.name === "ValidationError" ? 400 : 500);
  return { error: sanitizeError(error).error, status };
}

export async function withRateLimit(request, limiter = apiRatelimit) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")?.[0]?.trim()
    || request.headers.get("x-real-ip")
    || "anonymous";
  const result = await checkRateLimit(ip, limiter);
  if (!result.allowed) {
    throw new RateLimitError("Too many requests");
  }
  return result;
}

export class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = "RateLimitError";
    this.status = 429;
  }
}

export function logSecurityEvent(event, details = {}) {
  logger.warn(`SECURITY: ${event}`, details);
}

export function parseBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) return null;
  return request.json().catch(() => null);
}

export async function requireAdmin() {
  const session = await requireAuth();
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
  const email = session.emailAddresses?.[0]?.emailAddress || "";
  if (adminEmails.length > 0 && !adminEmails.includes(email.toLowerCase())) {
    throw new AuthError("Admin access required");
  }
  return session;
}

export async function handleApiError(error, request) {
  logError(error, {
    url: request?.url,
    method: request?.method,
  });

  const status = error.status || (error.name === "ValidationError" ? 400 : 500);
  const body = status === 500 ? { error: "Internal server error" } : sanitizeError(error);
  return Response.json(body, { status });
}
