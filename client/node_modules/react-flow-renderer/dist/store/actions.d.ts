import { Elements, OnConnectEndFunc, OnConnectFunc, OnConnectStartFunc, OnConnectStopFunc, NodeDimensionUpdate, NodePosUpdate, NodeDiffUpdate, XYPosition, Transform, Dimensions, InitD3ZoomPayload, TranslateExtent, SetConnectionId, SnapGrid, ConnectionMode } from '../types';
export declare const setOnConnect: (onConnect: OnConnectFunc) => {
    type: "SET_ON_CONNECT";
    payload: {
        onConnect: OnConnectFunc;
    };
};
export declare const setOnConnectStart: (onConnectStart: OnConnectStartFunc) => {
    type: "SET_ON_CONNECT_START";
    payload: {
        onConnectStart: OnConnectStartFunc;
    };
};
export declare const setOnConnectStop: (onConnectStop: OnConnectStopFunc) => {
    type: "SET_ON_CONNECT_STOP";
    payload: {
        onConnectStop: OnConnectStopFunc;
    };
};
export declare const setOnConnectEnd: (onConnectEnd: OnConnectEndFunc) => {
    type: "SET_ON_CONNECT_END";
    payload: {
        onConnectEnd: OnConnectEndFunc;
    };
};
export declare const setElements: (elements: Elements<any>) => {
    type: "SET_ELEMENTS";
    payload: Elements<any>;
};
export declare const updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
    type: "UPDATE_NODE_DIMENSIONS";
    payload: NodeDimensionUpdate[];
};
export declare const updateNodePos: (payload: NodePosUpdate) => {
    type: "UPDATE_NODE_POS";
    payload: NodePosUpdate;
};
export declare const updateNodePosDiff: (payload: NodeDiffUpdate) => {
    type: "UPDATE_NODE_POS_DIFF";
    payload: NodeDiffUpdate;
};
export declare const setUserSelection: (mousePos: XYPosition) => {
    type: "SET_USER_SELECTION";
    payload: XYPosition;
};
export declare const updateUserSelection: (mousePos: XYPosition) => {
    type: "UPDATE_USER_SELECTION";
    payload: XYPosition;
};
export declare const unsetUserSelection: () => {
    type: "UNSET_USER_SELECTION";
};
export declare const setSelection: (selectionActive: boolean) => {
    type: "SET_SELECTION";
    payload: {
        selectionActive: boolean;
    };
};
export declare const unsetNodesSelection: () => {
    type: "UNSET_NODES_SELECTION";
    payload: {
        nodesSelectionActive: boolean;
    };
};
export declare const resetSelectedElements: () => {
    type: "RESET_SELECTED_ELEMENTS";
    payload: {
        selectedElements: null;
    };
};
export declare const setSelectedElements: (elements: Elements<any>) => {
    type: "SET_SELECTED_ELEMENTS";
    payload: Elements<any>;
};
export declare const addSelectedElements: (elements: Elements<any>) => {
    type: "ADD_SELECTED_ELEMENTS";
    payload: Elements<any>;
};
export declare const updateTransform: (transform: Transform) => {
    type: "UPDATE_TRANSFORM";
    payload: {
        transform: Transform;
    };
};
export declare const updateSize: (size: Dimensions) => {
    type: "UPDATE_SIZE";
    payload: {
        width: number;
        height: number;
    };
};
export declare const initD3Zoom: (payload: InitD3ZoomPayload) => {
    type: "INIT_D3ZOOM";
    payload: InitD3ZoomPayload;
};
export declare const setMinZoom: (minZoom: number) => {
    type: "SET_MINZOOM";
    payload: number;
};
export declare const setMaxZoom: (maxZoom: number) => {
    type: "SET_MAXZOOM";
    payload: number;
};
export declare const setTranslateExtent: (translateExtent: TranslateExtent) => {
    type: "SET_TRANSLATEEXTENT";
    payload: TranslateExtent;
};
export declare const setConnectionPosition: (connectionPosition: XYPosition) => {
    type: "SET_CONNECTION_POSITION";
    payload: {
        connectionPosition: XYPosition;
    };
};
export declare const setConnectionNodeId: (payload: SetConnectionId) => {
    type: "SET_CONNECTION_NODEID";
    payload: SetConnectionId;
};
export declare const setSnapToGrid: (snapToGrid: boolean) => {
    type: "SET_SNAPTOGRID";
    payload: {
        snapToGrid: boolean;
    };
};
export declare const setSnapGrid: (snapGrid: SnapGrid) => {
    type: "SET_SNAPGRID";
    payload: {
        snapGrid: SnapGrid;
    };
};
export declare const setInteractive: (isInteractive: boolean) => {
    type: "SET_INTERACTIVE";
    payload: {
        nodesDraggable: boolean;
        nodesConnectable: boolean;
        elementsSelectable: boolean;
    };
};
export declare const setNodesDraggable: (nodesDraggable: boolean) => {
    type: "SET_NODES_DRAGGABLE";
    payload: {
        nodesDraggable: boolean;
    };
};
export declare const setNodesConnectable: (nodesConnectable: boolean) => {
    type: "SET_NODES_CONNECTABLE";
    payload: {
        nodesConnectable: boolean;
    };
};
export declare const setElementsSelectable: (elementsSelectable: boolean) => {
    type: "SET_ELEMENTS_SELECTABLE";
    payload: {
        elementsSelectable: boolean;
    };
};
export declare const setMultiSelectionActive: (multiSelectionActive: boolean) => {
    type: "SET_MULTI_SELECTION_ACTIVE";
    payload: {
        multiSelectionActive: boolean;
    };
};
export declare const setConnectionMode: (connectionMode: ConnectionMode) => {
    type: "SET_CONNECTION_MODE";
    payload: {
        connectionMode: ConnectionMode;
    };
};
export declare const setNodeExtent: (nodeExtent: TranslateExtent) => {
    type: "SET_NODE_EXTENT";
    payload: TranslateExtent;
};
export declare type ReactFlowAction = ReturnType<typeof setOnConnect | typeof setOnConnectStart | typeof setOnConnectStop | typeof setOnConnectEnd | typeof setElements | typeof updateNodeDimensions | typeof updateNodePos | typeof updateNodePosDiff | typeof setUserSelection | typeof updateUserSelection | typeof unsetUserSelection | typeof setSelection | typeof unsetNodesSelection | typeof resetSelectedElements | typeof setSelectedElements | typeof addSelectedElements | typeof updateTransform | typeof updateSize | typeof initD3Zoom | typeof setMinZoom | typeof setMaxZoom | typeof setTranslateExtent | typeof setConnectionPosition | typeof setConnectionNodeId | typeof setSnapToGrid | typeof setSnapGrid | typeof setInteractive | typeof setNodesDraggable | typeof setNodesConnectable | typeof setElementsSelectable | typeof setMultiSelectionActive | typeof setConnectionMode | typeof setNodeExtent>;
