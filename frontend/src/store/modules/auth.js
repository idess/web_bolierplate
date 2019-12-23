import { ajax } from "rxjs/observable/dom/ajax";
// import { useHistory } from "react-router-dom";
import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { setItem, getItem } from "../../service/local-storage.service";
import {errorMsg} from "../../service/message";

const INITIALIZE_INPUT = "auth/INITIALIZE_INPUT";

const CHANGE_INPUT = "auth/CHANGE_INPUT";

const REGISTER = "auth/REGISTER";
const REGISTER_SUCCESS = "auth/REGISTER_SUCCESS";
const REGISTER_FAILURE = "auth/REGISTER_FAILURE";

const LOGIN = "auth/LOGIN";
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const LOGIN_FAILURE = "auth/LOGIN_FAILURE";

const INITIALIZE_ERROR = "auth/INITIALIZE_ERROR";

const CHECK_USER = "auth/CHECK_USER";
const CHECK_USER_SUCCESS = "auth/CHECK_USER_SUCCESS";
const CHECK_USER_FAILURE = "auth/CHECK_USER_FAILURE";

const SET_USER_TEMP = "auth/SET_USER_TEMP";

const LOGOUT = "auth/LOGOUT";
const LOGOUT_SUCCESS = "auth/LOGOUT_SUCCESS";
const LOGOUT_FAILURE = "auth/LOGOUT_FAILURE";


export const initializeInput = () => ({
  type: INITIALIZE_INPUT
});

export const changeInput = ({ name, value }) => ({
  type: CHANGE_INPUT,
  payload: {
    name,
    value
  }
});

export const register = () => ({
  type: REGISTER
});

export const registerSuccess = ({ user, token }) => ({
  type: REGISTER_SUCCESS,
  payload: {
    user,
    token
  }
});

export const registerFailure = error => ({
  type: REGISTER_FAILURE,
  payload: {
    error
  }
});

export const login = () => ({
  type: LOGIN
});

export const loginSuccess = ({ created, id, ttl, userId }) => ({
  type: LOGIN_SUCCESS,
  payload: {
    created,
    id,
    ttl,
    userId
  }
});

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: {
    error
  }
});

export const initializeError = () => ({
  type: INITIALIZE_ERROR
});

export const checkUser = () => ({
  type: CHECK_USER
});

export const checkUserSuccess = () => ({
  type: CHECK_USER_SUCCESS
});

export const checkUserFailure = error => ({
  type: CHECK_USER_FAILURE,
  payload: {
    error
  }
});

export const setUserTemp = ({ id, username, token }) => ({
  type: SET_USER_TEMP,
  payload: {
    id,
    username,
    token
  }
});

export const logout = () => ({
  type: LOGOUT
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS
});

export const logoutFailure = () => ({
  type: LOGOUT_FAILURE
});

const registerEpic = (action$, state$) => {
  return action$.pipe(
    ofType(REGISTER),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const { username, password } = state.auth.form;
      return ajax.post(`/api/auth/register/`, { username, password }).pipe(
        map(response => {
          const { user, token } = response.response;
          return registerSuccess({ user, token });
        }),
        catchError(error =>
          of({
            type: REGISTER_FAILURE,
            payload: error,
            error: true
          })
        )
      );
    })
  );
};

const loginEpic = (action$, state$) => {
  return action$.pipe(
    ofType(LOGIN),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const { username, password } = state.auth.form;
      console.log({ username, password });
      return api('post', `/Accounts/login`, { username, password }).pipe(
        tap(res => {
          console.log(res);
          const { created, id, ttl, userId } = res.response;
          setItem('AUTH.USERINFO', { created, id, ttl, userId });
        }),
        map(response => {
          const { created, id, ttl, userId } = response.response;
          return loginSuccess({ created, id, ttl, userId });
        }),
        catchError(error =>
          of({
            type: LOGIN_FAILURE,
            payload: error,
            error: true
          }).pipe(
              tap( err => console.log(err.payload)),
              tap( err => errorMsg(err.payload))
          )
        )
      );
    })
  );
};

const checkUserEpic = (action$, state$) => {
  return action$.pipe(
    ofType(CHECK_USER),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      return ajax
        .get(`/api/auth/user/`, {
          "Content-Type": "application/json",
          Authorization: `token ${token}`
        })
        .pipe(
          map(response => {
            return checkUserSuccess();
          }),
          catchError(error =>
            of({
              type: CHECK_USER_FAILURE,
              payload: error,
              error: true
            })
          )
        );
    })
  );
};
const logoutEpic = (action$, state$) => {
  return action$.pipe(
    ofType(LOGOUT),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return api('post', `/Accounts/logout`, ).pipe(
          tap(res => {
            console.log(res);
            // const history = useHistory();
            // history.push("/auth/login");
            setItem('AUTH.USERINFO', {});
            window.location.href = '/auth/login';
          }),
          map(response => {
            return logoutSuccess();
          }),
          catchError(error =>
              of({
                type: LOGOUT_FAILURE,
                payload: error,
                error: true
              })
          )
      );
    })
  );
};

let user = getItem('AUTH.USERINFO');
let logged = user !== undefined;
const initialState = {
  form: {
    username: "",
    password: ""
  },
  error: {
    triggered: false,
    message: ""
  },
  logged: logged,
  userInfo: user //getItem('AUTH.USERINFO')
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_INPUT:
      return {
        ...state,
        form: {
          username: "",
          password: ""
        },
        logged: false
      };
    case CHANGE_INPUT:
      let newForm = state.form;
      newForm[action.payload.name] = action.payload.value;
      return {
        ...state,
        form: newForm
      };
    case INITIALIZE_ERROR:
      return {
        ...state,
        error: {
          triggered: false,
          message: ""
        }
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        logged: true,
        userInfo: {
          id: action.payload.user.id,
          username: action.payload.user.username,
          token: action.payload.token
        }
      };
    case REGISTER_FAILURE:
      switch (action.payload.status) {
        case 400:
          return {
            ...state,
            error: {
              triggered: true,
              message: "WRONG USERNAME OR PASSWORD"
            }
          };
        case 500:
          return {
            ...state,
            error: {
              triggered: true,
              message: "TOO SHORT USERNAME OR PASSWORD"
            }
          };
        default:
          return {
            ...state
          };
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        logged: true,
        userInfo: {
          id: action.payload.userId,
          token: action.payload.id,
          created: action.payload.created,
          ttl: action.payload.created
        }
      };
    case LOGIN_FAILURE:
      switch (action.payload.status) {
        case 400:
          return {
            ...state,
            error: {
              triggered: true,
              message: "WRONG USERNAME OR PASSWORD"
            }
          };
        case 500:
          return {
            ...state,
            error: {
              triggered: true,
              message: "PLEASE TRY AGAIN"
            }
          };
        default:
          return {
            ...state
          };
      }
    case CHECK_USER_SUCCESS:
      return {
        ...state
      };
    case CHECK_USER_FAILURE:
      return {
        ...state,
        logged: false,
        userInfo: {
          id: null,
          username: "",
          token: null
        }
      };
    case SET_USER_TEMP:
      return {
        ...state,
        logged: true,
        userInfo: {
          id: action.payload.id,
          username: action.payload.username,
          token: action.payload.token
        }
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        logged: false,
        userInfo: {
          id: null,
          message: "",
          token: null
        }
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        error: {
          triggered: true,
          message: "LOGOUT ERROR, PLEASE TRY AGAIN"
        }
      };

    default:
      return state;
  }
};

export const authEpics = { registerEpic, loginEpic, checkUserEpic, logoutEpic };
