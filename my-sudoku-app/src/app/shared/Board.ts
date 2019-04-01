export interface Board {
    //$key: string;
    boardName:string;
    sudoku:number[][];//9x9
    rate:{rating:number,vote :number}
    feedback:{player:string,playerFeedback:string }[];

}