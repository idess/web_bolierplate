import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { errorMsg, successMsg } from "../../service/message";

const USER_RULES_READ             = "[User Rules] Read";
const USER_RULES_SUCCESS          = "[User Rules] Read Success";
const USER_RULES_FAILURE          = "[User Rules] Read Failure";

const USER_RULES_CREATE             = "[User Rules] Create";
const USER_RULES_CREATE_SUCCESS     = "[User Rules] Create Success";
const USER_RULES_CREATE_FAILURE     = "[User Rules] Create Failure";

const USER_RULES_UPDATE             = "[User Rules] Update";
const USER_RULES_UPDATE_SUCCESS     = "[User Rules] Update Success";
const USER_RULES_UPDATE_FAILURE     = "[User Rules] Update Failure";

const USER_RULES_DELETE             = "[User Rules] Delete";
const USER_RULES_DELETE_SUCCESS     = "[User Rules] Delete Success";
const USER_RULES_DELETE_FAILURE     = "[User Rules] Delete Failure";

const USER_RULES_CLEAR             = "[User Rules] Clear";
const USER_RULES_UPDATE_CLEAR      = "[User Rules] Update Clear";


export const userRulesRead = (filter) => ({
    type: USER_RULES_READ,
    payload: filter
});

export const userRulesReadSuccess = ({ count, data }) => ({
    type: USER_RULES_SUCCESS,
    payload: {
        count,
        data
    }
});

export const userRulesReadFailure = error => ({
    type: USER_RULES_FAILURE,
    payload: {
        error
    }
});

export const userRulesCreate = ({ name, description}) => ({
    type: USER_RULES_CREATE,
    payload: { name, description}
});

export const userRulesCreateSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: USER_RULES_CREATE_SUCCESS,
    payload: { id, name, description, created, modified, isDelete }
});

export const userRulesCreateFailure = error => ({
    type: USER_RULES_CREATE_FAILURE,
    payload: {
        error
    }
});

export const userRulesUpdate = ({id, name, description, created, modified, isDelete}) => ({
    type: USER_RULES_UPDATE,
    payload: {id, name, description, created, modified, isDelete}
});

export const userRulesUpdateSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: USER_RULES_UPDATE_SUCCESS,
    payload: { id, name, description, created, modified, isDelete }
});

export const userRulesUpdateFailure = error => ({
    type: USER_RULES_UPDATE_FAILURE,
    payload: {
        error
    }
});

export const userRulesDelete = (id) => ({
    type: USER_RULES_DELETE,
    payload: id
});

export const userRulesDeleteSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: USER_RULES_DELETE_SUCCESS,
    payload: {id, name, description, created, modified, isDelete}
});

export const userRulesDeleteFailure = error => ({
    type: USER_RULES_DELETE_FAILURE,
    payload: {
        error
    }
});

export const userRuleClear = () => ({
    type: USER_RULES_CLEAR
});

export const userRuleUpdateClear = () => ({
    type: USER_RULES_UPDATE_CLEAR
});

const userRulesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_RULES_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            return api('get',`/Roles`, action.payload).pipe(
                map(response => {
                    const { count, data } = response.response;
                    return userRulesReadSuccess({ count, data });
                }),
                catchError(err =>
                    of({
                        type: USER_RULES_FAILURE,
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

const userRulesCreateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_RULES_CREATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('post',`/Roles`, action.payload).pipe(
                tap(res => {
                    successMsg({ message:'권한 추가가 완료되었습니다.', name:'권한 추가 완료' });
                }),
                map(response => {
                    // const { user, token } = response.response;
                    return userRulesCreateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: USER_RULES_CREATE_FAILURE,
                        payload: error,
                        error: true
                    }).pipe(
                        tap( err => {
                            errorMsg(err.payload)
                        })
                    )
                )
            );
        })
    );
};

const userRulesUpdateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_RULES_UPDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { id } = action.payload;
            return api('patch',`/Roles/${id}`, action.payload).pipe(
                tap(res => successMsg({name:'권한 수정 완료', message:'권한 수정이 완료되었습니다.'}) ),
                map(response => {
                    // const { user, token } = response.response;
                    return userRulesUpdateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: USER_RULES_UPDATE_FAILURE,
                        payload: error,
                        error: true
                    })
                )
            );
        })
    );
};

const userRulesDeleteEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_RULES_DELETE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('delete',`/Roles/${action.payload.id}`, action.payload).pipe(
                tap(res => successMsg({name:'권한 삭제 완료', message:'권한 삭제가 완료되었습니다.'}) ),
                map(response => {
                    // const { user, token } = response.response;
                    return userRulesDeleteSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: USER_RULES_DELETE_FAILURE,
                        payload: error,
                        error: true
                    }).pipe( tap( err => { errorMsg(err.payload) }))
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

export const userRules = (state = initialState, action) => {
    switch (action.type) {
        case USER_RULES_SUCCESS:
            console.log(action.payload);
            return {
                ...state,
                contents: action.payload
            };
        case USER_RULES_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case USER_RULES_CREATE_SUCCESS:
            return {
                ...state,
                update: 'CREATE'
            };
        case USER_RULES_CREATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case USER_RULES_UPDATE_SUCCESS:
            return {
                ...state,
                update: 'UPDATE'
            };
        case USER_RULES_UPDATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case USER_RULES_DELETE_SUCCESS:
            return {
                ...state,
                update: 'DELETE'
            };
        case USER_RULES_DELETE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case USER_RULES_UPDATE_CLEAR:
            return {
                ...state,
                update: ''
            };

        case USER_RULES_CLEAR:
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

export const userRulesEpics = { userRulesEpic, userRulesCreateEpic, userRulesUpdateEpic, userRulesDeleteEpic };
