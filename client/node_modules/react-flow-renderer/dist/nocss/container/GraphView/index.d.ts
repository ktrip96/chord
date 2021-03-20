import React from 'react';
import { ReactFlowProps } from '../ReactFlow';
import { NodeTypesType, EdgeTypesType, ConnectionLineType, KeyCode } from '../../types';
export interface GraphViewProps extends Omit<ReactFlowProps, 'onSelectionChange' | 'elements'> {
    nodeTypes: NodeTypesType;
    edgeTypes: EdgeTypesType;
    selectionKeyCode: KeyCode;
    deleteKeyCode: KeyCode;
    multiSelectionKeyCode: KeyCode;
    connectionLineType: ConnectionLineType;
    snapToGrid: boolean;
    snapGrid: [number, number];
    onlyRenderVisibleElements: boolean;
    defaultZoom: number;
    defaultPosition: [number, number];
    arrowHeadColor: string;
    selectNodesOnDrag: boolean;
}
declare const _default: React.MemoExoticComponent<{
    ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onLoad, onElementClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDragStart, onNodeDrag, onNodeDragStop, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, connectionMode, connectionLineType, connectionLineStyle, connectionLineComponent, selectionKeyCode, multiSelectionKeyCode, zoomActivationKeyCode, onElementsRemove, deleteKeyCode, onConnect, onConnectStart, onConnectStop, onConnectEnd, snapToGrid, snapGrid, onlyRenderVisibleElements, nodesDraggable, nodesConnectable, elementsSelectable, selectNodesOnDrag, minZoom, maxZoom, defaultZoom, defaultPosition, translateExtent, nodeExtent, arrowHeadColor, markerEndId, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, paneMoveable, onPaneClick, onPaneScroll, onPaneContextMenu, onEdgeUpdate, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, edgeUpdaterRadius, }: GraphViewProps): JSX.Element;
    displayName: string;
}>;
export default _default;
