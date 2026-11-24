// interfaces.ts
export interface User {
    readonly user_id: number;
    username:         string;
    nickname:         string | null;
    bio:              string | null;
};

export interface UserUpdate {
    user_id:  number;
    username: string   | null;
    nickname: string   | null;
    bio:      string   | null;
};

export interface Registration {
    readonly user_id:       number;
    password_hash:          string;
    readonly creation_date: string;  
};

export interface SelectedUser {
    user_id: number;
    password_hash: string;
};

export interface NewUser {
    username: string;
    password: string;
    nickname: string | null;
    bio:      string | null;
}

export interface Chatroom {
    readonly chatroom_id: number;
    name:                 string;
    bio:                  string | null;
};

export interface NewChatroom {
    creator_username :   string;
    name             :   string;
    bio              :   string | null;
};

export interface Message {
    readonly message_id: number;
    readonly sender_id:  number;
    content:             string;
};

export interface MessageExchange {
    readonly message_id:    number;
    readonly chatroom_id:   number;
    readonly exchange_date: string;
    readonly exchange_time: string;
};