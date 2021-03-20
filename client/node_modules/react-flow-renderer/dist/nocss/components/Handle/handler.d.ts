import { MouseEvent as ReactMouseEvent } from 'react';
import { ElementId, XYPosition, OnConnectFunc, OnConnectStartFunc, OnConnectStopFunc, OnConnectEndFunc, ConnectionMode, SetConnectionId, Connection } from '../../types';
declare type ValidConnectionFunc = (connection: Connection) => boolean;
export declare type SetSourceIdFunc = (params: SetConnectionId) => void;
export declare type SetPosition = (pos: XYPosition) => void;
export declare function onMouseDown(event: ReactMouseEvent, handleId: ElementId | null, nodeId: ElementId, setConnectionNodeId: SetSourceIdFunc, setPosition: SetPosition, onConnect: OnConnectFunc, isTarget: boolean, isValidConnection: ValidConnectionFunc, connectionMode: ConnectionMode, onConnectStart?: OnConnectStartFunc, onConnectStop?: OnConnectStopFunc, onConnectEnd?: OnConnectEndFunc): void;
export {};
