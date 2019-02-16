import { Friend } from './friend';

export interface User  extends Friend {
    $key: string;
    nickName: string;
    login: boolean;
    password: number;
    friendList?: Friend[]
}
