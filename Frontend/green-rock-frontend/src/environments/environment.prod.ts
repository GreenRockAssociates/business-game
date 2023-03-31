export const environment = {
  // production: true,
  // baseServerUrl: "//pfe.enzofilangi.fr/api", // Use "//" instead of "http://" so angular considers it a relative url and sends the CSRF tokens
  // authenticationService: "/auth",
  // launcherService: "/launcher",
  // queryService: "/query",
  // commandService: "/command",
  // webSocketUrl: "ws://pfe.enzofilangi.fr/api/real-time-update"

  production: false,
  baseServerUrl: "//localhost", // Use "//" instead of "http://" so angular considers it a relative url and sends the CSRF tokens
  authenticationService: ":30000/api/auth",
  launcherService: ":30001/api/launcher",
  queryService: ":30002/api/query",
  commandService: ":30003/api/command",
  webSocketUrl: "ws://localhost:30004"
};
