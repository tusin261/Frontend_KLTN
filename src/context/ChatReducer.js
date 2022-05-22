const ChatReducer = (state, action) => {
    switch (action.type) {
        case 'GET_CHATS_START':
            console.log('start')
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case 'GET_CHATS_SUCCESS':
            console.log('chat success')
            return {
                ...state,
                isLoading: false,
                chats: action.payload
            };
        case 'ADD_CHATS':
            return {
                ...state,
                chats:[...state.chats,action.payload]
            };
        case 'GET_CHATS_FAILURE':
            console.log('chat fail')
            return {
                ...state,
                isLoading: false,
                isError: true
            };
        default:
            return state;
    }
}
export default ChatReducer