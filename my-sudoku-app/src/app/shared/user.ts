import { Friend } from './friend';

export interface User  extends Friend {
    $key: string;
    nickName: string;
    login: boolean;
    password: number;
    point : number;
    friendList?: Friend[]
    grade:{boardName:string,time:string,score:number,difficulty:string }[];
    gradeCompetition:{boardName:string,time:string,score:number,difficulty:string,rival:string}[];
}
