export interface Collaboration {
    from:string;
    to:string;
    difficulty:string;
    boradName:string;
    chat:{name:string,massage:string}[];
    sudokuBoard:string[][];//9x9
    shareBoard:string[][];//9x9
    done:string;
    win:string;
 }
 