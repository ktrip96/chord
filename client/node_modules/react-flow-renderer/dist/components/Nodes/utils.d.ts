import { HandleElement } from '../../types';
export declare const getHandleBounds: (nodeElement: HTMLDivElement, scale: number) => {
    source: HandleElement[] | null;
    target: HandleElement[] | null;
};
export declare const getHandleBoundsByHandleType: (selector: string, nodeElement: HTMLDivElement, parentBounds: ClientRect | DOMRect, k: number) => HandleElement[] | null;
