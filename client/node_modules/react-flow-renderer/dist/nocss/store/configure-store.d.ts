import { Store } from 'redux';
import { ReactFlowState } from '../types';
import { ReactFlowAction } from './actions';
export default function configureStore(preloadedState: ReactFlowState): Store<ReactFlowState, ReactFlowAction>;
