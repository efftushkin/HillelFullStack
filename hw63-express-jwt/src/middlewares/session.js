const sessions = new Map();

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function sessionManager(req, res, next) {
  let sessionId = req.headers['x-session-id'];

  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = generateSessionId();
    sessions.set(sessionId, { createdAt: new Date(), requestCount: 0 });
  }

  const session = sessions.get(sessionId);
  session.requestCount += 1;
  session.lastAccessedAt = new Date();

  req.session = session;
  req.sessionId = sessionId;
  res.setHeader('X-Session-Id', sessionId);

  next();
}

module.exports = sessionManager;
