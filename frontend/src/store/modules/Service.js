import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { api } from "../../service/common";
import { errorMsg, successMsg } from "../../service/message";

const PRODUCT_READ             = "[Services] Product Read";
const PRODUCT_SUCCESS          = "[Services] Product Read Success";
const PRODUCT_FAILURE          = "[Services] Product Read Failure";

const VENDOR_READ             = "[Services] Vendor Read";
const VENDOR_SUCCESS          = "[Services] Vendor Read Success";
const VENDOR_FAILURE          = "[Services] Vendor Read Failure";

const CODE_READ             = "[Services] Code Read";
const CODE_SUCCESS          = "[Services] Code Read Success";
const CODE_FAILURE          = "[Services] Code Read Failure";


const SERVICES_READ             = "[Services] Read";
const SERVICES_SUCCESS          = "[Services] Read Success";
const SERVICES_FAILURE          = "[Services] Read Failure";

const SERVICES_CREATE             = "[Services] Create";
const SERVICES_CREATE_SUCCESS     = "[Services] Create Success";
const SERVICES_CREATE_FAILURE     = "[Services] Create Failure";

const SERVICES_UPDATE             = "[Services] Update";
const SERVICES_UPDATE_SUCCESS     = "[Services] Update Success";
const SERVICES_UPDATE_FAILURE     = "[Services] Update Failure";

const SERVICES_DELETE             = "[Services] Delete";
const SERVICES_DELETE_SUCCESS     = "[Services] Delete Success";
const SERVICES_DELETE_FAILURE     = "[Services] Delete Failure";

const SERVICES_CLEAR             = "[Services] Clear";
const SERVICES_UPDATE_CLEAR      = "[Services] Update Clear";


export const productsRead = () => ({
    type: PRODUCT_READ
});

export const productsReadSuccess = (data) => ({
    type: PRODUCT_SUCCESS,
    payload: data
});

export const productsReadFailure = error => ({
    type: PRODUCT_FAILURE,
    payload: { error }
});

export const vendorsRead = () => ({
    type: VENDOR_READ
});

export const vendorsReadSuccess = ( data ) => ({
    type: VENDOR_SUCCESS,
    payload: data
});

export const vendorsReadFailure = error => ({
    type: VENDOR_FAILURE,
    payload: { error }
});

export const codeRead = () => ({
    type: CODE_READ
});

export const codeReadSuccess = ( data ) => ({
    type: CODE_SUCCESS,
    payload: data
});

export const codeReadFailure = error => ({
    type: CODE_FAILURE,
    payload: { error }
});




export const servicesRead = () => ({
    type: SERVICES_READ
});

export const servicesReadSuccess = ({ count, data }) => ({
    type: SERVICES_SUCCESS,
    payload: { count, data }
});

export const servicesReadFailure = error => ({
    type: SERVICES_FAILURE,
    payload: { error }
});

export const servicesCreate = ({ name, remark, ip, port, authId, authPw, authKey, type, vendor, product, connectionType, intervalUnit, intervalValue, feed }) => ({
    type: SERVICES_CREATE,
    payload: { name, remark, ip, port, authId, authPw, authKey, type, vendor, product, connectionType, intervalUnit, intervalValue, feed }
});

export const servicesCreateSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: SERVICES_CREATE_SUCCESS,
    payload: { id, name, description, created, modified, isDelete }
});

export const servicesCreateFailure = error => ({
    type: SERVICES_CREATE_FAILURE,
    payload: {
        error
    }
});

export const servicesUpdate = ({ id, name, remark, ip, port, authId, authPw, authKey, type, vendor, product, isDelete, connectionType, intervalUnit, intervalValue, feed }) => ({
    type: SERVICES_UPDATE,
    payload: {id, name, remark, ip, port, authId, authPw, authKey, type, vendor, product, isDelete, connectionType, intervalUnit, intervalValue, feed }
});

export const servicesUpdateSuccess = ({ id, name, description, created, modified, isDelete }) => ({
    type: SERVICES_UPDATE_SUCCESS,
    payload: { id, name, description, created, modified, isDelete }
});

export const servicesUpdateFailure = error => ({
    type: SERVICES_UPDATE_FAILURE,
    payload: {
        error
    }
});

export const servicesDelete = ({ id }) => ({
    type: SERVICES_DELETE,
    payload: { id }
});

export const servicesDeleteSuccess = () => ({
    type: SERVICES_DELETE_SUCCESS
});

export const servicesDeleteFailure = error => ({
    type: SERVICES_DELETE_FAILURE,
    payload: {
        error
    }
});


const codeEpic = (action$, state$) => {
    return action$.pipe(
        ofType(CODE_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            return api('get',`/Codes`).pipe(
                map(response => {
                    // const { count, data } = response.response;
                    return codeReadSuccess(response.response.data);
                }),
                catchError(err =>
                    of({
                        type: CODE_FAILURE,
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

const productEpic = (action$, state$) => {
    return action$.pipe(
        ofType(PRODUCT_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            return api('get',`/Products`).pipe(
                map(response => {
                    // const { count, data } = response.response;
                    return productsReadSuccess(response.response.data);
                }),
                catchError(err =>
                    of({
                        type: PRODUCT_FAILURE,
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

const vendorEpic = (action$, state$) => {
    return action$.pipe(
        ofType(VENDOR_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            return api('get',`/Vendors`).pipe(
                map(response => {
                    // const { count, data } = response.response;
                    return vendorsReadSuccess(response.response.data);
                }),
                catchError(err =>
                    of({
                        type: VENDOR_FAILURE,
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



const servicesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SERVICES_READ),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('get',`/Devices/list`, action.payload).pipe(
                map(response => {
                    const { count, data } = response.response;
                    return servicesReadSuccess({ count, data });
                }),
                catchError(err =>
                    of({
                        type: SERVICES_FAILURE,
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

const servicesCreateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SERVICES_CREATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            // const { username, password } = action.payload;
            return api('post',`/Devices/save`, { data : action.payload }).pipe(
                tap(res => {
                    successMsg({ message:'서비스 추가가 완료되었습니다.', name:'서비스 추가 완료' });
                }),
                map(response => {
                    // const { user, token } = response.response;
                    return servicesCreateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: SERVICES_CREATE_FAILURE,
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

const servicesUpdateEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SERVICES_UPDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { id } = action.payload;
            return api('put',`/Devices/${id}/update`, { id: action.payload.id, data : action.payload }).pipe(
                map(response => {
                    // const { user, token } = response.response;
                    return servicesUpdateSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: SERVICES_UPDATE_FAILURE,
                        payload: error,
                        error: true
                    })
                )
            );
        })
    );
};

const servicesDeleteEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SERVICES_DELETE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const { id } = action.payload;
            return api('delete',`/Devices/${id}`, { id }).pipe(
                map(response => {
                    // const { user, token } = response.response;
                    return servicesDeleteSuccess(response.response);
                }),
                catchError(error =>
                    of({
                        type: SERVICES_DELETE_FAILURE,
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
    product: [],
    vendor: [],
    code: [],
    update: '',
    error: {
        triggered: false,
        message: ""
    }
};

export const services = (state = initialState, action) => {
    switch (action.type) {

        case CODE_SUCCESS:
            return {
                ...state,
                code: action.payload
            };
        case CODE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case PRODUCT_SUCCESS:
            return {
                ...state,
                product: action.payload
            };
        case PRODUCT_FAILURE:
            return {
                ...state,
                error: action.payload
            };


        case VENDOR_SUCCESS:
            return {
                ...state,
                vendor: action.payload
            };
        case VENDOR_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case SERVICES_SUCCESS:
            return {
                ...state,
                contents: action.payload
            };
        case SERVICES_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case SERVICES_CREATE_SUCCESS:
            return {
                ...state,
                update: 'CREATE'
            };
        case SERVICES_CREATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case SERVICES_UPDATE_SUCCESS:
            return {
                ...state,
                update: 'UPDATE'
            };
        case SERVICES_UPDATE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case SERVICES_DELETE_SUCCESS:
            return {
                ...state,
                update: 'DELETE'
            };
        case SERVICES_DELETE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case SERVICES_UPDATE_CLEAR:
            return {
                ...state,
                update: ''
            };

        case SERVICES_CLEAR:
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

export const servicesEpics = { servicesEpic, servicesCreateEpic, servicesUpdateEpic, servicesDeleteEpic, productEpic, vendorEpic, codeEpic };
