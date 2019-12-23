import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { errorMsg, successMsg } from "../../service/message";

const SEARCH_READ             = "[Search] Read";
const SEARCH_SUCCESS          = "[Search] Read Success";
const SEARCH_FAILURE          = "[Search] Read Failure";

const SEARCH_FIELD_READ       = "[Search] Field Read";
const SEARCH_FIELD_SUCCESS    = "[Search] Field Read Success";
const SEARCH_FIELD_FAILURE    = "[Search] Field Read Failure";

const SEARCH_SAVE             = "[Search] Save";
const SEARCH_SAVE_SUCCESS     = "[Search] Save Success";
const SEARCH_SAVE_FAILURE     = "[Search] Save Failure";

const SEARCH_DETAIL           = "[Search] Detail";
const SEARCH_DETAIL_SUCCESS   = "[Search] Detail Success";
const SEARCH_DETAIL_FAILURE   = "[Search] Detail Failure";

const SEARCH_UPDATE_CLEAR     = "[Search] Update Clear";
const SEARCH_CLEAR            = "[Search] Clear";

export const searchRead = ({ start_time, end_time, time_zone, filter }) => ({
    type: SEARCH_READ,
    payload: { start_time, end_time, time_zone, filter }
});

export const searchReadSuccess = ({ total_count, data }) => ({
    type: SEARCH_SUCCESS,
    payload: { total_count, data }
});

export const searchReadFailure = error => ({
    type: SEARCH_FAILURE,
    payload: {
        error
    }
});


export const searchDetailRead = ({ search_id }) => ({
    type: SEARCH_DETAIL,
    payload: { search_id }
});

export const searchDetailSuccess = (data) => ({
    type: SEARCH_DETAIL_SUCCESS,
    payload: data
});

export const searchDetailFailure = error => ({
    type: SEARCH_DETAIL_FAILURE,
    payload: {
        error
    }
});

export const searchFieldRead = () => ({
    type: SEARCH_FIELD_READ
});

export const searchFieldReadSuccess = ({ data }) => ({
    type: SEARCH_FIELD_SUCCESS,
    payload: {
        data
    }
});

export const searchFieldReadFailure = error => ({
    type: SEARCH_FIELD_FAILURE,
    payload: {
        error
    }
});


export const searchSave = ({ mode, keyword }) => ({
    type: SEARCH_SAVE,
    payload: { mode, keyword }
});

export const searchSaveSuccess = () => ({
    type: SEARCH_SAVE_SUCCESS
});

export const searchSaveFailure = error => ({
    type: SEARCH_SAVE_FAILURE,
    payload: {
        error
    }
});

export const searchUpdateClear = () => ({
    type: SEARCH_UPDATE_CLEAR
});

const searchEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SEARCH_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { start_time, end_time, time_zone, filter } = action.payload;
            return api('get',`/Searches/list`, { start_time, end_time, time_zone, filter }).pipe(
                map(response => {
                    const { total_count, data } = response.response; //took, timed_out, _shards, hits
                    return searchReadSuccess({ total_count, data });
                }),
                catchError(err =>
                    of({
                        type: SEARCH_FAILURE,
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


const searchDetailEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SEARCH_DETAIL),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { search_id } = action.payload;
            return api('get',`/Searches/detail`, { search_id }).pipe(
                map(response => {
                    // const { _index, _type, _id, _score, _source } = response.response; //took, timed_out, _shards, hits
                    return searchDetailSuccess(response.response);
                }),
                catchError(err =>
                    of({
                        type: SEARCH_DETAIL_FAILURE,
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

const searchSaveEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SEARCH_SAVE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { mode, keyword } = action.payload;
            return api('post',`/Searches/save`, { mode, keyword }).pipe(
                tap(res => successMsg({name:'조회 추가 완료', message:'평판조회 추가가 완료되었습니다.'})),
                map(response => {
                    // const { total_count, data } = response.response; //took, timed_out, _shards, hits
                    return searchSaveSuccess();
                }),
                catchError(err =>
                    of({
                        type: SEARCH_SAVE_FAILURE,
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

const searchFieldEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SEARCH_FIELD_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            return api('get',`/Searches/fieldInfo`).pipe(
                map(response => {
                    const { data } = response.response;
                    return searchFieldReadSuccess({ data });
                }),
                catchError(err =>
                    of({
                        type: SEARCH_FIELD_FAILURE,
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

const initialState = {
    contents: {
        total_count: 0,
        data: []
    },
    detail: [],
    update: '',
    fields: [],
    error: {
        triggered: false,
        message: ""
    }
};

export const search = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_SUCCESS:
            return {
                ...state,
                contents: action.payload
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case SEARCH_DETAIL_SUCCESS:
            return {
                ...state,
                detail: action.payload
            };
        case SEARCH_DETAIL_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case SEARCH_SAVE_SUCCESS:
            return {
                ...state,
                update: 'SAVE'
            };

        case SEARCH_SAVE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case SEARCH_FIELD_SUCCESS:
            return {
                ...state,
                fields: action.payload.data
            };
        case SEARCH_FIELD_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case SEARCH_UPDATE_CLEAR:
            return {
                ...state,
                update: ''
            };

        case SEARCH_CLEAR:
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

export const searchEpics = { searchEpic, searchFieldEpic, searchSaveEpic, searchDetailEpic };
