import { Elements, KeyCode } from '../types';
interface HookParams {
    deleteKeyCode: KeyCode;
    multiSelectionKeyCode: KeyCode;
    onElementsRemove?: (elements: Elements) => void;
}
declare const _default: ({ deleteKeyCode, multiSelectionKeyCode, onElementsRemove }: HookParams) => void;
export default _default;
