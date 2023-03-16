export const environment = {
  production: true,
  baseServerUrl: "//pfe.enzofilangi.fr/api", // Use "//" instead of "http://" so angular considers it a relative url and sends the CSRF tokens
  authenticationService: "/auth",
  launcherService: "/launcher",
  queryService: "/query",
  commandService: "/command",
  realTimeUpdateService: "/real-time-update"
};
