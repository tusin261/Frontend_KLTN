const NotificationReducer = (state, action) => {
    switch (action.type) {
        case 'GET_NOTIFICATION':
            console.log('start get notifition');
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        case 'GET_NOTIFICATION_SUCCESS':
            console.log('success get notifition');
            return {
                ...state,
                isLoading: false,
                notifications: action.payload
            }
        case 'GET_NOTIFICATION_FAIL':
            console.log('fail get notifition');
            return {
                ...state,
                isLoading: false,
                isError: true
            };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
    }
}

export default NotificationReducer