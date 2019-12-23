// import { ajax } from "rxjs/observable/dom/ajax";
import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { errorMsg, successMsg } from "../../service/message";
// import { setItem } from "../../service/local-storage.service";
// import { useAlert } from 'react-alert'


const ACCOUNTS_READ             = "[Account] Read";
const ACCOUNTS_SUCCESS          = "[Account] Read Success";
const ACCOUNTS_FAILURE          = "[Account] Read Failure";

const ACCOUNTS_CREATE             = "[Account] Create";
const ACCOUNTS_CREATE_SUCCESS     = "[Account] Create Success";
const ACCOUNTS_CREATE_FAILURE     = "[Account] Create Failure";

const ACCOUNTS_UPDATE             = "[Account] Update";
const ACCOUNTS_UPDATE_SUCCESS     = "[Account] Update Success";
const ACCOUNTS_UPDATE_FAILURE     = "[Account] Update Failure";

const ACCOUNTS_DELETE             = "[Account] Delete";
const ACCOUNTS_DELETE_SUCCESS     = "[Account] Delete Success";
const ACCOUNTS_DELETE_FAILURE     = "[Account] Delete Failure";

const ACCOUNTS_CLEAR             = "[Account] Clear";
const ACCOUNTS_UPDATE_CLEAR      = "[Account] Update Clear";


export const accountsRead = () => ({
    type: ACCOUNTS_READ
});

export const accountsReadSuccess = ({ count, data }) => ({
    type: ACCOUNTS_SUCCESS,
    payload: {
        count,
        data
    }
});

export const accountsReadFailure = error => ({
    type: ACCOUNTS_FAILURE,
    payload: {
        error
    }
});

export const accountsCreate = ({realm, password, username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone}) => ({
    type: ACCOUNTS_CREATE,
    payload: {
        realm,
        username,
        email,
        password,
        emailVerified,
        verificationtoken,
        isDelete,
        isUsed,
        contact,
        roleId,
        level,
        departmentId,
        displayName,
        timezone
    }
});

export const accountsCreateSuccess = ({ created, id, ttl, userId }) => ({
    type: ACCOUNTS_CREATE_SUCCESS,
    payload: {
        created,
        id,
        ttl,
        userId
    }
});

export const accountsCreateFailure = error => ({
    type: ACCOUNTS_CREATE_FAILURE,
    payload: {
        error
    }
});

export const accountsUpdate = ({id, realm, password, username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone}) => ({
    type: ACCOUNTS_UPDATE,
    payload: {
        id,
        realm,
        username,
        email,
        password,
        emailVerified,
        verificationtoken,
        isDelete,
        isUsed,
        contact,
        roleId,
        level,
        departmentId,
        displayName,
        timezone
    }
});

export const accountsUpdateSuccess = ({ created, id, ttl, userId }) => ({
    type: ACCOUNTS_UPDATE_SUCCESS,
    payload: {
        created,
        id,
        ttl,
        userId
    }
});

export const accountsUpdateFailure = error => ({
    type: ACCOUNTS_UPDATE_FAILURE,
    payload: {
        error
    }
});

export const accountsDelete = () => ({
    type: ACCOUNTS_DELETE
});

export const accountsDeleteSuccess = ({ created, id, ttl, userId }) => ({
    type: ACCOUNTS_DELETE_SUCCESS,
    payload: {
        created,
        id,
        ttl,
        userId
    }
});

export const accountsDeleteFailure = error => ({
    type: ACCOUNTS_DELETE_FAILURE,
    payload: {
        error
    }
});


const accountsEpic = (action$, state$) => {
    return action$.pipe(
        ofType(ACCOUNTS_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('get',`/Accounts`, action.payload).pipe(
                map(response => {
                    const { count, data } = response.response;
                    return accountsReadSuccess({ count, data });
                }),
                catchError(err =>
                    of({
                        type: ACCOUNTS_FAILURE,
                        payload: err,
                        error: true
                    }).pipe(
                        tap( err => errorMsg(err.payload))
                    )
                )
            );
        })
    );
};

const accountsCreateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(ACCOUNTS_CREATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('post',`/Accounts`, action.payload).pipe(
                tap(res => {
                    successMsg({ message:'사용자 추가가 완료되었습니다.', name:'사용자추가 완료' });
                }),
                map(response => {
                    // const { user, token } = response.response;
                    return accountsCreateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: ACCOUNTS_CREATE_FAILURE,
                        payload: error,
                        error: true
                    }).pipe(
                        tap( err => console.log(err)),
                        tap( err => {
                            errorMsg(err.payload)
                        })
                    )
                )
            );
        })
    );
};

const accountsUpdateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(ACCOUNTS_UPDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { id } = action.payload;
            return api('patch',`/Accounts/${id}`, action.payload).pipe(
                map(response => {
                    // const { user, token } = response.response;
                    return accountsUpdateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: ACCOUNTS_UPDATE_FAILURE,
                        payload: error,
                        error: true
                    })
                )
            );
        })
    );
};

const accountsDeleteEpic = (action$, state$) => {
    return action$.pipe(
        ofType(ACCOUNTS_DELETE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('delete',`/Accounts`, action.payload).pipe(
                map(response => {
                    // const { user, token } = response.response;
                    return accountsDeleteSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: ACCOUNTS_DELETE_FAILURE,
                        payload: error,
                        error: true
                    })
                )
            );
        })
    );
};

const initialState = {
    contents: {
        count:0,
        data: []
    },
    update: '',
    error: {
        triggered: false,
        message: ""
    }
};

export const accounts = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNTS_SUCCESS:
            console.log(action.payload);
            return {
                ...state,
                contents: action.payload
            };
        case ACCOUNTS_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case ACCOUNTS_CREATE_SUCCESS:
            return {
                ...state,
                update: 'CREATE'
            };
        case ACCOUNTS_CREATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case ACCOUNTS_UPDATE_SUCCESS:
            return {
                ...state,
                update: 'UPDATE'
            };
        case ACCOUNTS_UPDATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case ACCOUNTS_DELETE_SUCCESS:
            return {
                ...state,
                update: 'DELETE'
            };
        case ACCOUNTS_DELETE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case ACCOUNTS_UPDATE_CLEAR:
            return {
                ...state,
                update: ''
            };

        case ACCOUNTS_CLEAR:
            return {
                ...state,
                update: '',
                contents: undefined,
                error: undefined
            };

        default:
            return state;
    }
};

export const accountsEpics = { accountsEpic, accountsCreateEpic, accountsUpdateEpic, accountsDeleteEpic };
