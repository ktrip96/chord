import { ReactFlowState } from '../types';
export declare const initialState: ReactFlowState;
declare const store: import("redux").Store<ReactFlowState, import("./actions").ReactFlowAction>;
export declare type ReactFlowDispatch = typeof store.dispatch;
export default store;
