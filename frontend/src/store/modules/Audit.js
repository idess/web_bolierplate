import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { errorMsg, successMsg } from "../../service/message";

const AUDIT_LOG_READ             = "[Audit Log] Read";
const AUDIT_LOG_SUCCESS          = "[Audit Log] Read Success";
const AUDIT_LOG_FAILURE          = "[Audit Log] Read Failure";

// const AUDIT_LOG_CREATE             = "[Audit Log] Create";
// const AUDIT_LOG_CREATE_SUCCESS     = "[Audit Log] Create Success";
// const AUDIT_LOG_CREATE_FAILURE     = "[Audit Log] Create Failure";

const AUDIT_LOG_CLEAR             = "[Audit Log] Clear";
// const AUDIT_LOG_UPDATE_CLEAR      = "[Audit Log] Update Clear";


export const auditLogRead = (filter) => ({
    type: AUDIT_LOG_READ,
    payload: filter
});

export const auditLogReadSuccess = ({ count, data }) => ({
    type: AUDIT_LOG_SUCCESS,
    payload: {
        count,
        data
    }
});

export const auditLogReadFailure = error => ({
    type: AUDIT_LOG_FAILURE,
    payload: {
        error
    }
});

// export const auditLogCreate = ({id, name, description, created, modified, isDelete}) => ({
//     type: AUDIT_LOG_CREATE,
//     payload: {id, name, description, created, modified, isDelete}
// });
//
// export const auditLogCreateSuccess = ({ id, name, description, created, modified, isDelete }) => ({
//     type: AUDIT_LOG_CREATE_SUCCESS,
//     payload: { id, name, description, created, modified, isDelete }
// });
//
// export const auditLogCreateFailure = error => ({
//     type: AUDIT_LOG_CREATE_FAILURE,
//     payload: {
//         error
//     }
// });


const auditLogEpic = (action$, state$) => {
    return action$.pipe(
        ofType(AUDIT_LOG_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('get',`/AuditLogs`, action.payload).pipe(
                map(response => {
                    const { count, data } = response.response;
                    return auditLogReadSuccess({ count, data });
                }),
                catchError(err =>
                    of({
                        type: AUDIT_LOG_FAILURE,
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

// const auditLogCreateEpic = (action$, state$) => {
//     return action$.pipe(
//         ofType(AUDIT_LOG_CREATE),
//         withLatestFrom(state$),
//         mergeMap(([action, state]) => {
//             // const { username, password } = action.payload;
//             return api('post',`/Roles`, action.payload).pipe(
//                 tap(res => {
//                     successMsg({ message:'권한 추가가 완료되었습니다.', name:'권한 추가 완료' });
//                 }),
//                 map(response => {
//                     // const { user, token } = response.response;
//                     return auditLogCreateSuccess(response.response);
//                 }),
//                 catchError(error =>
//                     of({
//                         type: AUDIT_LOG_CREATE_FAILURE,
//                         payload: error,
//                         error: true
//                     }).pipe(
//                         tap( err => console.log(err)),
//                         tap( err => {
//                             errorMsg(err.payload)
//                         })
//                     )
//                 )
//             );
//         })
//     );
// };

const initialState = {
    contents: {
        count:0,
        data: []
    },
    // update: '',
    error: {
        triggered: false,
        message: ""
    }
};

export const auditLog = (state = initialState, action) => {
    switch (action.type) {
        case AUDIT_LOG_SUCCESS:
            console.log(action.payload);
            return {
                ...state,
                contents: action.payload
            };
        case AUDIT_LOG_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        // case AUDIT_LOG_CREATE_SUCCESS:
        //     return {
        //         ...state,
        //         update: 'CREATE'
        //     };
        // case AUDIT_LOG_CREATE_FAILURE:
        //     return {
        //         ...state,
        //         error: action.payload
        //     };
        //
        // case AUDIT_LOG_UPDATE_CLEAR:
        //     return {
        //         ...state,
        //         update: ''
        //     };

        case AUDIT_LOG_CLEAR:
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

export const auditLogEpics = { auditLogEpic }; //, auditLogCreateEpic
