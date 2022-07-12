export const LOG_IN = "log_in";
export const LOG_OUT = "log_out";

export function logInAction() {
    return { type: LOG_IN };
}

export function logOutAction() {
    return { type: LOG_OUT };
}

const initialState = {
    token: null,
}

export default function blogAuthReducer(state = initialState, action) {
    switch (action.type) {
        // e.g action = { type: LOG_IN }
        // action.type returns LOG_IN
        case LOG_IN:
            // if action.type is LOG_IN state = {token:null}
            // { ...{token: null}}
            // {token: null}

            // action = {payload: "access_token"}
            // action.payload returns "access_token"

            return { ...state, token: action.payload };
            // since we have token: action.payload,
            // this will override ...state which returns {token:null}

            case LOG_OUT:
            return { ...state, token: null };
        default:
            return state;
    }
}