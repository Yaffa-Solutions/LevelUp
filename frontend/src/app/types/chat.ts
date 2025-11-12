export interface UserInfo {
  id:string;
  profil_picture: string | null;
  role: string | null;
  first_name: string;
  last_name: string;
}

export interface Message {
  id: string | null;
  content: string | null;
  sender_id: string;
  created_at: string;
}

export interface Chat {
  id: string;
  type: string;
  user1_id: string;
  user2_id: string;
  user1: UserInfo;
  user2: UserInfo;
  messages: Message[];
}

export interface ActiveChat{
  otherUser:UserInfo|null;
  activeChat:Chat|null;
  setActiveChat:(chat: Chat, user: UserInfo)=>void;
}