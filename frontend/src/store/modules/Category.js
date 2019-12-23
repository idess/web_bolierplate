import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { errorMsg, successMsg } from "../../service/message";

const CATEGORIES_READ             = "[Categories] Read";
const CATEGORIES_SUCCESS          = "[Categories] Read Success";
const CATEGORIES_FAILURE          = "[Categories] Read Failure";

const CATEGORIES_CREATE             = "[Categories] Create";
const CATEGORIES_CREATE_SUCCESS     = "[Categories] Create Success";
const CATEGORIES_CREATE_FAILURE     = "[Categories] Create Failure";

const CATEGORIES_UPDATE             = "[Categories] Update";
const CATEGORIES_UPDATE_SUCCESS     = "[Categories] Update Success";
const CATEGORIES_UPDATE_FAILURE     = "[Categories] Update Failure";

const CATEGORIES_DELETE             = "[Categories] Delete";
const CATEGORIES_DELETE_SUCCESS     = "[Categories] Delete Success";
const CATEGORIES_DELETE_FAILURE     = "[Categories] Delete Failure";

const CATEGORIES_CLEAR             = "[Categories] Clear";
const CATEGORIES_UPDATE_CLEAR      = "[Categories] Update Clear";


export const categoriesRead = () => ({
    type: CATEGORIES_READ
});

export const categoriesReadSuccess = ({ count, data }) => ({
    type: CATEGORIES_SUCCESS,
    payload: {
        count,
        data
    }
});

export const categoriesReadFailure = error => ({
    type: CATEGORIES_FAILURE,
    payload: {
        error
    }
});

export const categoriesCreate = ({id, name, description, created, modified, isDelete}) => ({
    type: CATEGORIES_CREATE,
    payload: {id, name, description, created, modified, isDelete}
});

export const categoriesCreateSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: CATEGORIES_CREATE_SUCCESS,
    payload: { id, name, description, created, modified, isDelete }
});

export const categoriesCreateFailure = error => ({
    type: CATEGORIES_CREATE_FAILURE,
    payload: {
        error
    }
});

export const categoriesUpdate = ({id, name, description, created, modified, isDelete}) => ({
    type: CATEGORIES_UPDATE,
    payload: {id, name, description, created, modified, isDelete}
});

export const categoriesUpdateSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: CATEGORIES_UPDATE_SUCCESS,
    payload: { id, name, description, created, modified, isDelete }
});

export const categoriesUpdateFailure = error => ({
    type: CATEGORIES_UPDATE_FAILURE,
    payload: {
        error
    }
});

export const categoriesDelete = () => ({
    type: CATEGORIES_DELETE
});

export const categoriesDeleteSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: CATEGORIES_DELETE_SUCCESS,
    payload: {id, name, description, created, modified, isDelete}
});

export const categoriesDeleteFailure = error => ({
    type: CATEGORIES_DELETE_FAILURE,
    payload: {
        error
    }
});


const categoriesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(CATEGORIES_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('get',`/Roles`, action.payload).pipe(
                map(response => {
                    const { count, data } = response.response;
                    return categoriesReadSuccess({ count, data });
                }),
                catchError(err =>
                    of({
                        type: CATEGORIES_FAILURE,
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

const categoriesCreateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(CATEGORIES_CREATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('post',`/Roles`, action.payload).pipe(
                tap(res => {
                    successMsg({ message:'카테고리 추가가 완료되었습니다.', name:'카테고리 추가 완료' });
                }),
                map(response => {
                    // const { user, token } = response.response;
                    return categoriesCreateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: CATEGORIES_CREATE_FAILURE,
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

const categoriesUpdateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(CATEGORIES_UPDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { id } = action.payload;
            return api('patch',`/Roles/${id}`, action.payload).pipe(
                map(response => {
                    // const { user, token } = response.response;
                    return categoriesUpdateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: CATEGORIES_UPDATE_FAILURE,
                        payload: error,
                        error: true
                    })
                )
            );
        })
    );
};

const categoriesDeleteEpic = (action$, state$) => {
    return action$.pipe(
        ofType(CATEGORIES_DELETE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('delete',`/Roles`, action.payload).pipe(
                map(response => {
                    // const { user, token } = response.response;
                    return categoriesDeleteSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: CATEGORIES_DELETE_FAILURE,
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

export const categories = (state = initialState, action) => {
    switch (action.type) {
        case CATEGORIES_SUCCESS:
            console.log(action.payload);
            return {
                ...state,
                contents: action.payload
            };
        case CATEGORIES_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case CATEGORIES_CREATE_SUCCESS:
            return {
                ...state,
                update: 'CREATE'
            };
        case CATEGORIES_CREATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case CATEGORIES_UPDATE_SUCCESS:
            return {
                ...state,
                update: 'UPDATE'
            };
        case CATEGORIES_UPDATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case CATEGORIES_DELETE_SUCCESS:
            return {
                ...state,
                update: 'DELETE'
            };
        case CATEGORIES_DELETE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case CATEGORIES_UPDATE_CLEAR:
            return {
                ...state,
                update: ''
            };

        case CATEGORIES_CLEAR:
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

export const categoriesEpics = { categoriesEpic, categoriesCreateEpic, categoriesUpdateEpic, categoriesDeleteEpic };
