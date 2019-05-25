export interface Board {
    boardName:string;
    sudoku:number[][];//9x9
    rate:{rating:number,vote :number}
    feedback:{player:string,playerFeedback:string }[];

}