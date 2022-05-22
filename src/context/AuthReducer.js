const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            console.log('Login start');
            return {
                ...state,
                isLoading: true,
                user: null,
                isError: false
            }
        case 'LOGIN_SUCCESS':
            console.log('Login success', action.payload);
            return {
                ...state,
                isLoading: false,
                user: action.payload,
                isError: false
            }
        case 'LOGIN_FAIL':
            console.log('Login fail', action.payload);
            return {
                ...state,
                isLoading: false,
                user: null,
                isError: action.payload
            }
        case 'LOGOUT':
            console.log('Logout');
            return {
                ...state,
                isLoading: false,
                user: null,
                isError: false
            }
        case 'UPDATE_IMG':
            console.log('update image');
            return {
                ...state,
                isLoading: false,
                user: {
                    ...state.user,
                    image_url: action.payload
                },
                isError: false
            }
        case 'UPDATE_IN4':
            console.log('update in4');
            return {
                ...state,
                isLoading: false,
                user: {
                    ...state.user,
                    first_name: action.payload.first_name,
                    last_name:action.payload.last_name,
                    email:action.payload.email
                },
                isError: false
            }
        default:
            return state;
    }
}
export default AuthReducer