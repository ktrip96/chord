import { ReactNode } from 'react';
import { FlowTransform, TranslateExtent, PanOnScrollMode, KeyCode } from '../../types';
interface ZoomPaneProps {
    selectionKeyPressed: boolean;
    elementsSelectable?: boolean;
    zoomOnScroll?: boolean;
    zoomOnPinch?: boolean;
    panOnScroll?: boolean;
    panOnScrollSpeed?: number;
    panOnScrollMode?: PanOnScrollMode;
    zoomOnDoubleClick?: boolean;
    paneMoveable?: boolean;
    defaultPosition?: [number, number];
    defaultZoom?: number;
    translateExtent?: TranslateExtent;
    onMove?: (flowTransform?: FlowTransform) => void;
    onMoveStart?: (flowTransform?: FlowTransform) => void;
    onMoveEnd?: (flowTransform?: FlowTransform) => void;
    zoomActivationKeyCode?: KeyCode;
    children: ReactNode;
}
declare const ZoomPane: ({ onMove, onMoveStart, onMoveEnd, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, selectionKeyPressed, elementsSelectable, paneMoveable, defaultPosition, defaultZoom, translateExtent, zoomActivationKeyCode, children, }: ZoomPaneProps) => JSX.Element;
export default ZoomPane;
