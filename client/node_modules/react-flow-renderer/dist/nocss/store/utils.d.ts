export declare function createAction<T extends string>(type: T): {
    type: T;
};
export declare function createAction<T extends string, P extends any>(type: T, payload: P): {
    type: T;
    payload: P;
};
