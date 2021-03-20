import React, { HTMLAttributes } from 'react';
import { Node } from '../../types';
declare type StringFunc = (node: Node) => string;
export interface MiniMapProps extends HTMLAttributes<SVGSVGElement> {
    nodeColor?: string | StringFunc;
    nodeStrokeColor?: string | StringFunc;
    nodeClassName?: string | StringFunc;
    nodeBorderRadius?: number;
    nodeStrokeWidth?: number;
    maskColor?: string;
}
declare const _default: React.MemoExoticComponent<{
    ({ style, className, nodeStrokeColor, nodeColor, nodeClassName, nodeBorderRadius, nodeStrokeWidth, maskColor, }: MiniMapProps): JSX.Element;
    displayName: string;
}>;
export default _default;
