const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;
const ENABLED = process.env.LOGGING_ENABLED !== "false";

function shouldLog(level) {
  return ENABLED && LOG_LEVELS[level] >= CURRENT_LEVEL;
}

function formatEntry(level, message, meta = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
    environment: process.env.NODE_ENV || "development",
  };
}

function write(level, message, meta) {
  if (!shouldLog(level)) return;
  const entry = formatEntry(level, message, meta);
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (msg, meta) => write("debug", msg, meta),
  info: (msg, meta) => write("info", msg, meta),
  warn: (msg, meta) => write("warn", msg, meta),
  error: (msg, meta) => write("error", msg, meta),
};

export function logError(error, context = {}) {
  logger.error(error.message || "Unknown error", {
    ...context,
    errorName: error.name,
    stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
  });
}

export function logRequest(request, statusCode, durationMs, extra = {}) {
  const url = request?.url || request?.toString?.() || "";
  const method = request?.method || "UNKNOWN";
  logger.info(`${method} ${url} → ${statusCode} (${durationMs}ms)`, {
    url,
    method,
    statusCode,
    durationMs,
    ...extra,
  });
}

export function startTimer() {
  const start = Date.now();
  return {
    stop: (meta) => {
      const duration = Date.now() - start;
      return { durationMs: duration, ...meta };
    },
    stopAndLog: (message, level = "info", meta) => {
      const duration = Date.now() - start;
      write(level, `${message} (${duration}ms)`, { ...meta, durationMs: duration });
      return duration;
    },
  };
}

export function withLogging(handler, routeName) {
  return async (...args) => {
    const request = args[0];
    const timer = startTimer();
    try {
      const response = await handler(...args);
      const statusCode = response?.status || 200;
      timer.stopAndLog(routeName || `${request?.method || "UNKNOWN"} ${request?.url || ""}`, "info", {
        statusCode,
        route: routeName,
      });
      return response;
    } catch (error) {
      const duration = timer.stop().durationMs;
      logError(error, { route: routeName, durationMs: duration });
      throw error;
    }
  };
}

export function withDbTimer(label) {
  const timer = startTimer();
  return {
    done: (extra = {}) => timer.stopAndLog(`DB: ${label}`, "debug", extra),
  };
}
