import { async, TestBed } from '@angular/core/testing';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';

describe('ShortcutService', () => {
    let service: ShortcutService;
    const modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], { isModalPresent: false });
    let subscriberSpyobj: jasmine.SpyObj<any>; // tslint:disable-line: no-any

    beforeEach(async(() => {
        subscriberSpyobj = jasmine.createSpyObj('Subscriber', ['shortcutNeedingCtrlPressed', 'shortcutNotNeedingCtrlPressed']);
        TestBed.configureTestingModule({
            providers: [{ provide: ModalService, useValue: modalServiceSpyObj }],
        });
        service = TestBed.inject(ShortcutService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onKeyDown should not emit if there is a modal displayed', async(() => {
        // tslint:disable-next-line: no-string-literal
        service['modalService'] = jasmine.createSpyObj('ModalService', [], { isModalPresent: true });
        service.selectToolRectangleShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: '1', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it('#onKeyDown should not emit if shortcuts are disabled', async(() => {
        service.areShortcutsEnabled = false;
        service.selectToolRectangleShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: '1', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it("#onKeyDown should emit openExportDrawingShortcut$ when shortcut selected is 'ctrl + e'", async(() => {
        service.openExportDrawingShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
        });
        const keyboardEventSpyObj = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
            key: 'e',
            ctrlKey: true,
        });
        service.onKeyDown(keyboardEventSpyObj);
        expect(keyboardEventSpyObj.preventDefault).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it("#onKeyDown should emit openGalleryShortcut$ when shortcut selected is 'ctrl + g'", async(() => {
        service.openGalleryShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
        });
        const keyboardEventSpyObj = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
            key: 'g',
            ctrlKey: true,
        });
        service.onKeyDown(keyboardEventSpyObj);
        expect(keyboardEventSpyObj.preventDefault).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it("#onKeyDown should emit openNewDrawingShortcut$ when shortcut selected is 'ctrl + o'", async(() => {
        service.openNewDrawingShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
        });
        const keyboardEventSpyObj = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
            key: 'o',
            ctrlKey: true,
        });
        service.onKeyDown(keyboardEventSpyObj);
        expect(keyboardEventSpyObj.preventDefault).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it("#onKeyDown should emit openSaveDrawingShortcut$ when shortcut selected is 'ctrl + s'", async(() => {
        service.openSaveDrawingShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
        });
        const keyboardEventSpyObj = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
            key: 's',
            ctrlKey: true,
        });
        service.onKeyDown(keyboardEventSpyObj);
        expect(keyboardEventSpyObj.preventDefault).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it("#onKeyDown should emit undoShortcut$ when shortcut selected is 'ctrl + z'", async(() => {
        service.undoShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
        });
        const keyboardEventSpyObj = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
            key: 'z',
            ctrlKey: true,
        });
        service.onKeyDown(keyboardEventSpyObj);
        expect(keyboardEventSpyObj.preventDefault).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it("#onKeyDown should emit redoShortcut$ when shortcut selected is 'ctrl + Z'", async(() => {
        service.redoShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNeedingCtrlPressed();
        });
        const keyboardEventSpyObj = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
            key: 'Z',
            ctrlKey: true,
        });
        service.onKeyDown(keyboardEventSpyObj);
        expect(keyboardEventSpyObj.preventDefault).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).not.toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolRectangleShortcut$ when shortcut selected is '1'", async(() => {
        service.selectToolRectangleShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: '1', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolEllipseShortcut$ when shortcut selected is '2'", async(() => {
        service.selectToolEllipseShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: '2', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolPolygonShortcut$ when shortcut selected is '3'", async(() => {
        service.selectToolPolygonShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: '3', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolSprayCanShortcut$ when shortcut selected is 'a'", async(() => {
        service.selectToolSprayCanShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'a', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolPencilShortcut$ when shortcut selected is 'c'", async(() => {
        service.selectToolPencilShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'c', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolEraserShortcut$ when shortcut selected is 'e'", async(() => {
        service.selectToolEraserShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'e', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit toggleGridShortcut$ when shortcut selected is 'g'", async(() => {
        service.toggleGrid$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'g', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolEyedropperShortcut$ when shortcut selected is 'i'", async(() => {
        service.selectToolEyedropperShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'i', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolLineShortcut$ when shortcut selected is 'l'", async(() => {
        service.selectToolLineShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'l', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolRecolorShortcut$ when shortcut selected is 'r'", async(() => {
        service.selectToolRecolorShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'r', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolSelectionShortcut$ when shortcut selected is 's'", async(() => {
        service.selectToolSelectionShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 's', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit selectToolPaintbrushShortcut$ when shortcut selected is 'w'", async(() => {
        service.selectToolPaintbrushShortcut$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: 'w', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit increaseGridSize$ when shortcut selected is '+'", async(() => {
        service.increaseGridSize$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: '+', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));

    it("#onKeyDown should emit decreaseGridSize$ when shortcut selected is '-'", async(() => {
        service.decreaseGridSize$.subscribe(() => {
            subscriberSpyobj.shortcutNotNeedingCtrlPressed();
        });
        const keyboardEvent = { key: '-', ctrlKey: false } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(subscriberSpyobj.shortcutNeedingCtrlPressed).not.toHaveBeenCalled();
        expect(subscriberSpyobj.shortcutNotNeedingCtrlPressed).toHaveBeenCalled();
    }));
});
