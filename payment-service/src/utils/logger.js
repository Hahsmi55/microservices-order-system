const log = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}${extra}`);
};

module.exports = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV === 'development') log('debug', msg, meta);
  },
};
