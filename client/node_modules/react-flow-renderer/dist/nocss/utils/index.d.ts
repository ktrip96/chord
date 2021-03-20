import { DraggableEvent } from 'react-draggable';
import { MouseEvent as ReactMouseEvent } from 'react';
import { Dimensions, XYPosition } from '../types';
export declare const isInputDOMNode: (e: ReactMouseEvent | DraggableEvent | KeyboardEvent) => boolean;
export declare const getDimensions: (node: HTMLDivElement) => Dimensions;
export declare const clamp: (val: number, min?: number, max?: number) => number;
export declare const clampPosition: (position: XYPosition, extent: import("../types").TranslateExtent) => {
    x: number;
    y: number;
};
