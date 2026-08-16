# calling
> Minimal Node.js WebSocket-based signaling server for WebRTC voice calls.

## Overview
A very small single-file Node.js signaling server that accepts WebSocket connections and routes JSON signaling messages between connected users. Implemented in server.js and intended as a lightweight prototype or proof-of-concept.

## What it does
- Accepts WebSocket connections using the ws library.
- Lets a client register a userId (message type "register") which the server stores in an in-memory Map.
- Routes JSON messages by looking up the destination userId and forwarding messages of types: call, offer, answer, ice_candidate, reject, end_call.
- Removes entries from the in-memory client map when sockets close.

## Key capabilities
- WebSocket-based signaling for WebRTC call setup.
- Simple user registration by userId.
- Message routing for common signaling events.
- Single-process, minimal-dependency codebase (only ws).
- Configurable listening port via PORT environment variable (default 8080).

## Technology
- Node.js (plain JavaScript)
- ws WebSocket library (dependency listed in package.json)

## Repository structure
- README.md — this file (previously empty).
- package.json — project manifest; contains "start" script and dependency "ws".
- server.js — single-file WebSocket signaling server implementation.

## Getting started
- The repository includes a start script in package.json: "start": "node server.js". The server listens on PORT (default 8080).
- There are no documented installation or runtime prerequisites or step-by-step setup instructions in this repository beyond the start script.

If you want to inspect how the server works before running it, open server.js. Relevant behaviors are visible there: WebSocket server creation, in-memory Map of clients, JSON.parse on incoming messages, switch logic on data.type, and cleanup on socket 'close' events.

## Configuration
- PORT environment variable: server reads a PORT value to decide which TCP port to listen on; default is 8080 (as observed in the code).
- Message types handled (observed): register, call, offer, answer, ice_candidate, reject, end_call.
- No further configuration files or documented runtime options are present in the repository.

## Development and quality notes
Observed gaps and immediate improvements to consider:
- No automated tests, linting, or CI configuration in the repository.
- No structured logging framework — code uses console.log / console.error.
- No input validation or schema enforcement on incoming messages; messages are only JSON.parsed and then forwarded.
- No authentication/authorization: the server trusts client-provided userId during registration.
- Single-process in-memory client map prevents horizontal scaling and is ephemeral across restarts.
- No keepalive (ping/pong) or rate-limiting; no message size limits — potential for stale connections or DoS.
- Potential bug: code checks targetWs.readyState === targetWs.OPEN. In typical ws usage OPEN is a static constant exported by the ws module (e.g., WebSocket.OPEN), so this check should be verified/fixed.
- Recommendations (non-exhaustive): add input validation, require authentication on register, implement ping/pong and graceful shutdown handlers, add rate limiting and message size limits, replace console logs with a structured logger, add tests and CI.

## Safety and responsible use
Important security observations:
- Clients can impersonate arbitrary userIds by sending a 'register' message with a chosen userId — there is no verification or authentication.
- Signaling messages are forwarded based solely on JSON content; an attacker could craft messages to spoof events or flood recipients.
- No TLS or TLS guidance is present in the code; if the server is run directly and exposed to the internet, signaling traffic will be unencrypted.
- No origin checks, no message size/rate limits, and no protections against resource exhaustion.
- Before deploying anywhere beyond a trusted development environment, implement authentication, transport encryption (TLS/reverse proxy), input validation, rate limiting, and other hardening measures listed above.

## Contributing
Contributions are welcome. To get started:
- Inspect server.js and package.json to understand current behavior and configuration.
- Open issues to report bugs, security concerns, or to propose enhancements (for example: authentication, input validation, tests, or scaling changes).
- Submit pull requests that include tests and clear changelogs; note that this repository currently has no test or CI setup.

(Note: the repository does not include contribution guidelines or a code of conduct file.)
