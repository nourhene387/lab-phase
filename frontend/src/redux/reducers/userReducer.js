const initialState = {
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
    sexe: '',
    dateofbirth: '',
    profilePic: '',
    error: '',
    loading: false,
    isauth: false // This will be set to true when the user is authenticated or successfully created
};

const userReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'SET_USER_INFO':
            return {
                ...state,
                ...payload // Spread the payload to update the user's info in state
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: payload.error // Set the error message in the state
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: payload // Set the loading state
            };

        case 'SET_AUTH':
            return {
                ...state,
                isauth: payload // Set isauth to true (or false depending on the payload)
            };
            case 'UPLOAD_PIC':
        return {
          ...state,
          Profilepic:payload
        };

        default:
            return state;
    }
};

export default userReducer;
