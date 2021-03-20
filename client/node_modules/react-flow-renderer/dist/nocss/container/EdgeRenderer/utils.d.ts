import { EdgeTypesType, Position, Node, XYPosition, ElementId, HandleElement, Transform, Edge } from '../../types';
export declare function createEdgeTypes(edgeTypes: EdgeTypesType): EdgeTypesType;
export declare function getHandlePosition(position: Position, node: Node, handle?: any | null): XYPosition;
export declare function getHandle(bounds: HandleElement[], handleId: ElementId | null): HandleElement | null;
interface EdgePositions {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}
export declare const getEdgePositions: (sourceNode: Node, sourceHandle: HandleElement | unknown, sourcePosition: Position, targetNode: Node, targetHandle: HandleElement | unknown, targetPosition: Position) => EdgePositions;
interface IsEdgeVisibleParams {
    sourcePos: XYPosition;
    targetPos: XYPosition;
    width: number;
    height: number;
    transform: Transform;
}
export declare function isEdgeVisible({ sourcePos, targetPos, width, height, transform }: IsEdgeVisibleParams): boolean;
declare type SourceTargetNode = {
    sourceNode: Node | null;
    targetNode: Node | null;
};
export declare const getSourceTargetNodes: (edge: Edge, nodes: Node[]) => SourceTargetNode;
export {};
