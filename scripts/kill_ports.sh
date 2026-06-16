#!/usr/bin/env sh
# Kill processes listening on common dev ports to avoid conflicts
for PORT in 3000 5001 5000; do
  PIDS="$(lsof -ti tcp:${PORT} 2>/dev/null)"
  if [ -n "$PIDS" ]; then
    echo "Killing processes on port ${PORT}: $PIDS"
    kill -9 $PIDS 2>/dev/null || true
  fi
done
echo "Port cleanup complete."
