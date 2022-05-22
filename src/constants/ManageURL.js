const BACKEND_URL = "http://localhost:5000/api/";

//login && register
export const LOGIN = BACKEND_URL+"auth/login";
export const SIGNUP = BACKEND_URL+"auth/register";
export const CONFIRM = BACKEND_URL+"auth/confirm-email"

//url cuoc tro chuyen
export const GET_ALL_CONVERSATION = BACKEND_URL+"chats";

//url search user
export const SEARCH_USER = BACKEND_URL+"users";

//user
export const CHANGE_AVATA = BACKEND_URL+"users/updateAvatar";

//group
export const CREATE_GROUP = BACKEND_URL+"chats/group";
export const CHANGE_AVATA_GROUP = BACKEND_URL+"chats/update-group";
export const RENAME_GROUP = BACKEND_URL+"chats/rename-group";
export const REMOVE_MEMBER_GROUP = BACKEND_URL+"chats/remove-group";
export const ADD_MEMBER_GROUP = BACKEND_URL+"chats/add-group";

//notification
export const GET_NOTI = BACKEND_URL+"notifications";
export const CREATE_NOTI_GROUP = BACKEND_URL+"notifications/notification-group";
export const CREATE_NOTI_FRIEND = BACKEND_URL+"notifications/notification-friend";
export const CREATE_NOTI_LIKE = BACKEND_URL+"notifications/notification-like";


