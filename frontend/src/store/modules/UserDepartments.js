import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { errorMsg, successMsg } from "../../service/message";



const USER_DEPARTMENTS_READ             = "[User Departments] Read";
const USER_DEPARTMENTS_SUCCESS          = "[User Departments] Read Success";
const USER_DEPARTMENTS_FAILURE          = "[User Departments] Read Failure";

const USER_DEPARTMENTS_CREATE             = "[User Departments] Create";
const USER_DEPARTMENTS_CREATE_SUCCESS     = "[User Departments] Create Success";
const USER_DEPARTMENTS_CREATE_FAILURE     = "[User Departments] Create Failure";

const USER_DEPARTMENTS_UPDATE             = "[User Departments] Update";
const USER_DEPARTMENTS_UPDATE_SUCCESS     = "[User Departments] Update Success";
const USER_DEPARTMENTS_UPDATE_FAILURE     = "[User Departments] Update Failure";

const USER_DEPARTMENTS_DELETE             = "[User Departments] Delete";
const USER_DEPARTMENTS_DELETE_SUCCESS     = "[User Departments] Delete Success";
const USER_DEPARTMENTS_DELETE_FAILURE     = "[User Departments] Delete Failure";

const USER_DEPARTMENTS_CLEAR             = "[User Departments] Clear";
const USER_DEPARTMENTS_UPDATE_CLEAR      = "[User Departments] Update Clear";


export const userDeptsRead = (filter) => ({
    type: USER_DEPARTMENTS_READ,
    payload: filter
});

export const userDeptsReadSuccess = ({ count, data }) => ({
    type: USER_DEPARTMENTS_SUCCESS,
    payload: { count, data }
});

export const userDeptsReadFailure = error => ({
    type: USER_DEPARTMENTS_FAILURE,
    payload: {
        error
    }
});

export const userDeptsCreate = ({ name, description }) => ({
    type: USER_DEPARTMENTS_CREATE,
    payload: { name, description }
});

export const userDeptsCreateSuccess = ({id, name, description, regDate, editDate, regId, editId, isDelete}) => ({
    type: USER_DEPARTMENTS_CREATE_SUCCESS,
    payload: {id, name, description, regDate, editDate, regId, editId, isDelete}
});

export const userDeptsCreateFailure = error => ({
    type: USER_DEPARTMENTS_CREATE_FAILURE,
    payload: {
        error
    }
});

export const userDeptsUpdate = ({id, name, description, regDate, editDate, regId, editId, isDelete}) => ({
    type: USER_DEPARTMENTS_UPDATE,
    payload: {id, name, description, regDate, editDate, regId, editId, isDelete}
});

export const userDeptsUpdateSuccess = ({id, name, description, regDate, editDate, regId, editId, isDelete}) => ({
    type: USER_DEPARTMENTS_UPDATE_SUCCESS,
    payload: {id, name, description, regDate, editDate, regId, editId, isDelete}
});

export const userDeptsUpdateFailure = error => ({
    type: USER_DEPARTMENTS_UPDATE_FAILURE,
    payload: {
        error
    }
});

export const userDeptsDelete = (id) => ({
    type: USER_DEPARTMENTS_DELETE,
    payload: id
});

export const userDeptsDeleteSuccess = ({id, name, description, regDate, editDate, regId, editId, isDelete}) => ({
    type: USER_DEPARTMENTS_DELETE_SUCCESS,
    payload: {id, name, description, regDate, editDate, regId, editId, isDelete}
});

export const userDeptsDeleteFailure = error => ({
    type: USER_DEPARTMENTS_DELETE_FAILURE,
    payload: {
        error
    }
});

export const userDeptsClear = () => ({
    type: USER_DEPARTMENTS_CLEAR
});

export const userDeptsUpdateClear = () => ({
    type: USER_DEPARTMENTS_UPDATE_CLEAR
});
/**
 * @effect userDeptsEpic 부서 Read Effect
 * */
const userDeptsEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_DEPARTMENTS_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('get',`/Departments`, action.payload).pipe(
                map(response => {
                    const { count, data } = response.response;
                    return userDeptsReadSuccess({ count, data });
                }),
                catchError(err =>
                    of({
                        type: USER_DEPARTMENTS_FAILURE,
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
/**
 * @effect userDeptsCreateEpic 부서 추가 Effect
 * 성공 Request -> 성공 메세지 -> Success Action
 * 실패 Request -> Failure Action -> 실패 메세지
 * */
const userDeptsCreateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_DEPARTMENTS_CREATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('post',`/Departments`, action.payload).pipe(
                tap(res => { successMsg({ message:'부서 추가가 완료되었습니다.', name:'부서 추가 완료' }); }),
                map(response => {
                    // const { user, token } = response.response;
                    return userDeptsCreateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: USER_DEPARTMENTS_CREATE_FAILURE,
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
/**
* @effect userDeptsUpdateEpic 부서 수정 Effect
* 성공 Request -> 성공 메세지 -> Success Action
* 실패 Request -> Failure Action -> 실패 메세지
* */
const userDeptsUpdateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_DEPARTMENTS_UPDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { id } = action.payload;
            return api('patch',`/Departments/${id}`, action.payload).pipe(
                tap(res => successMsg({name:'부서 수정 완료', message:'부서수정이 완료되었습니다.'}) ),
                map(response => {
                    return userDeptsUpdateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: USER_DEPARTMENTS_UPDATE_FAILURE,
                        payload: error,
                        error: true
                    }).pipe( tap( err => { errorMsg(err.payload) }))
                )
            );
        })
    );
};
/**
 * @effect userDeptsDeleteEpic 부서 삭제 Effect
 * 성공 Request -> 성공 메세지 -> Success Action
 * 실패 Request -> Failure Action -> 실패 메세지
 * */
const userDeptsDeleteEpic = (action$, state$) => {
    return action$.pipe(
        ofType(USER_DEPARTMENTS_DELETE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('delete',`/Departments/${action.payload.id}`, action.payload).pipe(
                tap(res => successMsg({name:'부서 삭제 완료', message:'부서 삭제가 완료되었습니다.'}) ),
                map(response => {
                    // const { user, token } = response.response;
                    return userDeptsDeleteSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: USER_DEPARTMENTS_DELETE_FAILURE,
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
        count: 0,
        data: []
    },
    update: '',
    error: {
        triggered: false,
        message: ""
    }
};

export const userDepts = (state = initialState, action) => {
    switch (action.type) {
        case USER_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                contents: action.payload
            };
        case USER_DEPARTMENTS_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case USER_DEPARTMENTS_CREATE_SUCCESS:
            return {
                ...state,
                update: 'CREATE'
            };
        case USER_DEPARTMENTS_CREATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case USER_DEPARTMENTS_UPDATE_SUCCESS:
            return {
                ...state,
                update: 'UPDATE'
            };
        case USER_DEPARTMENTS_UPDATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case USER_DEPARTMENTS_DELETE_SUCCESS:
            return {
                ...state,
                update: 'DELETE'
            };
        case USER_DEPARTMENTS_DELETE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case USER_DEPARTMENTS_UPDATE_CLEAR:
            return {
                ...state,
                update: ''
            };

        case USER_DEPARTMENTS_CLEAR:
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

export const userDeptsEpics = { userDeptsEpic, userDeptsCreateEpic, userDeptsUpdateEpic, userDeptsDeleteEpic };
