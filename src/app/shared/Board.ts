export interface Board {
    boardName:string;//Name of Sudoku Table
    sudoku:number[][];//The Sudoku Table (9x9)
    rate:{rating:number,vote :number}//Table rating
    feedback:{player:string,playerFeedback:string }[];//Feedback on the board

}