export interface Competition {
   from:string;
   to:string;
   difficulty:string;
   boradName:string;
   chat:{name:string,massage:string}[];
   sudokuBoard:string[][];//9x9
   done:string;
   win:string;
}
