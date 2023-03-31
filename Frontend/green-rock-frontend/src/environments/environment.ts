// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseServerUrl: "//localhost", // Use "//" instead of "http://" so angular considers it a relative url and sends the CSRF tokens
  authenticationService: ":30000/api/auth",
  launcherService: ":30001/api/launcher",
  queryService: ":30002/api/query",
  commandService: ":30003/api/command",
  webSocketUrl: "ws://localhost:30004"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
