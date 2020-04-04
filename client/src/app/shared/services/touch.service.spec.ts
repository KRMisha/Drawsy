import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';

describe('TouchService', () => {
    it('#getMouseEventFromTouchEvent should create a fake MouseEvent from a given TouchEvent', () => {
        const touchEventMock = {
            changedTouches: [{ clientX: 32, clientY: 64 } as Touch],
        } as unknown as TouchEvent;
        const expectedMouseEvent = {
            button: MouseButton.Left,
            clientX: 32,
            clientY: 64,
        } as MouseEvent;
        const actualMouseEvent = TouchService.getMouseEventFromTouchEvent(touchEventMock);
        expect(actualMouseEvent).toEqual(expectedMouseEvent);
    });
});
