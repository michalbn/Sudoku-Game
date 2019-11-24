// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyALsNGO0_F9pxl8aHIq8tOF7pmEUm6jHK0",
    authDomain: "my-sudoku-app.firebaseapp.com",
    databaseURL: "https://my-sudoku-app.firebaseio.com",
    projectId: "my-sudoku-app",
    storageBucket: "my-sudoku-app.appspot.com",
    messagingSenderId: "824258494595"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
