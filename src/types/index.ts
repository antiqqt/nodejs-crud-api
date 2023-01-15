export interface UserData {
    id: string;
    username: string;
    age: string;
    hobbies: string[];
}

export type UserBody = Omit<UserData, 'id'>;
