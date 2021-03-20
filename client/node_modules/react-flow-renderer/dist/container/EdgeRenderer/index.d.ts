import React, { CSSProperties } from 'react';
import { Edge, Node, Elements, ConnectionLineType, ConnectionLineComponent, ConnectionMode, Transform, OnEdgeUpdateFunc } from '../../types';
interface EdgeRendererProps {
    edgeTypes: any;
    connectionLineType: ConnectionLineType;
    connectionLineStyle?: CSSProperties;
    connectionLineComponent?: ConnectionLineComponent;
    connectionMode?: ConnectionMode;
    onElementClick?: (event: React.MouseEvent, element: Node | Edge) => void;
    arrowHeadColor: string;
    markerEndId?: string;
    onlyRenderVisibleElements: boolean;
    onEdgeUpdate?: OnEdgeUpdateFunc;
    onEdgeContextMenu?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeMouseEnter?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeMouseMove?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeMouseLeave?: (event: React.MouseEvent, edge: Edge) => void;
    edgeUpdaterRadius?: number;
}
interface EdgeWrapperProps {
    edge: Edge;
    props: EdgeRendererProps;
    nodes: Node[];
    selectedElements: Elements | null;
    elementsSelectable: boolean;
    transform: Transform;
    width: number;
    height: number;
    onlyRenderVisibleElements: boolean;
    connectionMode?: ConnectionMode;
}
declare const Edge: ({ edge, props, nodes, selectedElements, elementsSelectable, transform, width, height, onlyRenderVisibleElements, connectionMode, }: EdgeWrapperProps) => JSX.Element | null;
declare const _default: React.MemoExoticComponent<{
    (props: EdgeRendererProps): JSX.Element | null;
    displayName: string;
}>;
export default _default;
