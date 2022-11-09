import { MouseButton } from '@app/shared/enums/mouse-button.enum';

export class TouchService {
    static isMobileDevice = 'ontouchstart' in document.documentElement;
    static getMouseEventFromTouchEvent(event: TouchEvent): MouseEvent {
        return {
            button: MouseButton.Left,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
        } as MouseEvent;
    }
}
