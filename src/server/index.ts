import express from "express"
import helmet from "helmet"
import type { Router, Express } from "express"
import { LogLevel, getHttpLogger } from "./logger"
import { HTTP_SERVER_PORT, SHUTDOWN_TIMEOUT } from "../environment"
import { Duplex } from "node:stream"
import {
	Server as HttpServer,
	IncomingMessage,
	OutgoingMessage,
} from "node:http"
import pino from "pino"

export type RouteGroup = { basePath: string; router: ReturnType<typeof Router> }
export type Config = {
	name: string
	routes?: RouteGroup[]
}

const logger = pino<LogLevel>().child({ component: "server" })

export async function configureApp({
	app,
	routeGroups,
	name,
}: {
	app: Express
	routeGroups: RouteGroup[]
	name: string
}): Promise<Express> {
	const httpLogger = getHttpLogger()
	app.use(httpLogger)

	/* basic header security */
	// https://helmetjs.github.io/
	app.use(helmet())

	/* remove express fingerprint */
	// https://expressjs.com/en/advanced/best-practice-security.html#reduce-fingerprinting
	app.disable("x-powered-by")

	/* Register base route */
	//   - GET '/' -> service name
	app.get("/", (req, res) => {
		req.log.info("GET /", req)
		res.send(name).end()
	})

	/* Register state routes */
	//   Kubernetes probe endpoints
	//   https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
	//   - Liveliness probe
	//   - Readiness probe
	//   - Startup probe

	/* Register metrics middleware */
	/* Register body parsing middleware */
	/* Register CORS middleware */
	/* Register schema validation */
	/* Register other middleware */

	/* Register application routes */
	for (const group of routeGroups) {
		app.use(group.basePath, group.router)
		logger.info("Mounted route group", group.basePath)
	}

	/* Catch all route for unhandled requests */
	app.get("*", (req, res) => res.status(404).end())

	/* Register error middleware */
	// app.use((err, req, res, next) => {
	// if not http error (thrown by routes) catch and throw 500
	// if schema validation request error throw 400
	// if schema validation response error throw 500

	// remove fields we don't want to return with response
	//   - delete status
	//   - delete name
	//   - delete stack
	// });

	return app
}

// export async function instrumentServer(app: Express): Promise<Express> {
//    TODO: record connection count
//    return app;
// }

// function createHttpsServer() {
//   TODO: - generate certificates
// }
async function createHttpServer(app: Express): Promise<HttpServer> {
	return await new HttpServer(app)
}

async function createServer(
	cfg: Config,
): Promise<{ start: () => Promise<void>; stop: () => Promise<void> }> {
	let started = false
	let starting = false
	let stopping = false

	const expressApp = express()
	const app = await configureApp({
		app: expressApp,
		routeGroups: cfg.routes ?? [],
		name: cfg.name,
	})

	const httpServer = await createHttpServer(app)

	const sockets = new Set<Duplex>()
	function connectionListener(socket: Duplex) {
		if (stopping) {
			socket.destroy()
			return
		}

		sockets.add(socket)
		socket.once("close", () => {
			sockets.delete(socket)
		})
	}
	httpServer.on("connection", connectionListener)

	async function start(): Promise<void> {
		if (started) {
			logger.info("server already started")
			return
		}

		if (starting) {
			logger.info("server already starting")
			return
		}
		starting = true

		await new Promise<void>((resolve) => {
			httpServer.listen(HTTP_SERVER_PORT, () => {
				logger.info("started server")
				resolve()
			})
		})

		started = true
		starting = false
	}

	async function stop(): Promise<void> {
		if (!started) {
			logger.info("server not started")
			return
		}

		if (stopping) {
			logger.info("server already stopping")
			return
		}

		stopping = true
		logger.info("stopping server")
		await shutdown()
		logger.info("stopped server")
	}

	async function shutdown(): Promise<void> {
		const forceShutdownTimeout = setTimeout(async () => {
			// log warn shutdown timeout exceeded terminating
			logger.warn("shutdown timeout exceeded terminating")
			try {
				await close()
			} catch (err) {
				logger.error(
					"failed to close server after exceeding shutdown timeout",
					err,
				)
			}
		}, SHUTDOWN_TIMEOUT)

		const onRequest = (
			_: IncomingMessage,
			outgoingMessage: OutgoingMessage,
		) => {
			if (!outgoingMessage.headersSent) {
				outgoingMessage.setHeader("connection", "close")
			}
		}

		httpServer.on("request", onRequest)

		for (const socket of sockets) {
			try {
				socket.destroy()
			} catch (err) {
				logger.error("failed to destroy socket", err)
			}
			sockets.delete(socket)
		}

		while (sockets.size > 0) {
			logger.info("waiting for inflight connections to drain", sockets.size)
			await Bun.sleep(100)
		}
		clearTimeout(forceShutdownTimeout)
		await close()
	}

	async function close(): Promise<void> {
		await new Promise<void>((resolve) =>
			httpServer.close((err) => {
				if (err) {
					logger.error("failed to close server", err)
				}
				resolve()
			}),
		)
	}

	return {
		start,
		stop,
	}
}

export async function start(cfg: Config): Promise<() => Promise<void>> {
	const server = await createServer(cfg)

	// cached DNS
	// start telemetry

	await server.start()

	return async () => {
		await server.stop()

		// stop bus
		// stop telemetry
		// uninstall telemetry
		// await closeDb();
	}
}

/**
 * Block until SIGNINT or SIGTERM is received. run stop fn
 * @param stopFn
 */
export async function waitForExit(stopFn?: () => Promise<void>): Promise<void> {
	logger.info("waiting for exit")

	await new Promise<void>((resolve) => {
		process.on("SIGINT", async () => {
			logger.info("shutdown signal received")
			resolve()
		})

		process.on("SIGTERM", async () => {
			logger.info("shutdown signal received")
			resolve()
		})
	})

	if (stopFn) {
		await stopFn()
	}
}

export async function run(cfg: Config) {
	await waitForExit(await start(cfg))
}
