import React, { HTMLAttributes } from 'react';
import { FitViewParams } from '../../types';
export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
    showZoom?: boolean;
    showFitView?: boolean;
    showInteractive?: boolean;
    fitViewParams?: FitViewParams;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onFitView?: () => void;
    onInteractiveChange?: (interactiveStatus: boolean) => void;
}
declare const _default: React.MemoExoticComponent<{
    ({ style, showZoom, showFitView, showInteractive, fitViewParams, onZoomIn, onZoomOut, onFitView, onInteractiveChange, className, }: ControlProps): JSX.Element;
    displayName: string;
}>;
export default _default;
