/// <reference types="react" />
import { ElementId } from '../types';
declare type ContextProps = ElementId | null;
export declare const NodeIdContext: import("react").Context<Partial<ContextProps>>;
export declare const Provider: import("react").Provider<Partial<ContextProps>>;
export declare const Consumer: import("react").Consumer<Partial<ContextProps>>;
export default NodeIdContext;
