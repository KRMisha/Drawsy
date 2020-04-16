import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ModalService } from '@app/modals/services/modal.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { TouchService } from '@app/shared/services/touch.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Tool } from '@app/tools/services/tool';
import { Subject } from 'rxjs';

// tslint:disable: max-line-length
// tslint:disable: no-string-literal
// tslint:disable: no-any

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let drawingServiceMock: DrawingService;
    let changeDetectorRefSpyObj: jasmine.SpyObj<ChangeDetectorRef>;
    let currentToolSpyObj: jasmine.SpyObj<Tool>;
    let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;
    let gridServiceSpyObj: jasmine.SpyObj<GridService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;
    let modalServiceSpyObj: jasmine.SpyObj<ModalService>;

    let toggleGridSubject: Subject<void>;
    let increaseGridSizeSubject: Subject<void>;
    let decreaseGridSizeSubject: Subject<void>;
    let forceDetectChangesSubject: Subject<void>;

    const returnedDimensions: Vec2 = { x: 10, y: 10 };
    const drawingLabels = ['Please', 'Fix', 'This'];
    const colorString = 'CanaDank';
    beforeEach(async(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(colorString);
        forceDetectChangesSubject = new Subject<void>();
        drawingServiceMock = ({
            forceDetectChanges$: forceDetectChangesSubject,
            drawingRoot: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            svgDrawingContent: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            svgUserInterfaceContent: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            dimensions: returnedDimensions,
            labels: drawingLabels,
            backgroundColor: colorSpyObj,
            reappendStoredElements(): void {}, // tslint:disable-line: no-empty
            saveDrawingToStorage(): void {}, // tslint:disable-line: no-empty
        } as unknown) as DrawingService;

        changeDetectorRefSpyObj = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

        currentToolSpyObj = jasmine.createSpyObj('Tool', ['onToolDeselection']);
        currentToolServiceSpyObj = jasmine.createSpyObj(
            'CurrentToolService',
            [
                'onMouseMove',
                'onMouseDown',
                'onMouseUp',
                'onScroll',
                'onMouseDoubleClick',
                'onKeyDown',
                'onKeyUp',
                'onMouseEnter',
                'onMouseLeave',
            ],
            {
                currentTool: currentToolSpyObj,
            }
        );

        gridServiceSpyObj = jasmine.createSpyObj('GridService', ['toggleDisplay', 'increaseSize', 'decreaseSize'], {
            isDisplayEnabled: true,
            size: 10,
            opacity: 1,
        });

        toggleGridSubject = new Subject<void>();
        increaseGridSizeSubject = new Subject<void>();
        decreaseGridSizeSubject = new Subject<void>();
        shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            toggleGrid$: toggleGridSubject,
            increaseGridSize$: increaseGridSizeSubject,
            decreaseGridSize$: decreaseGridSizeSubject,
        });

        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: false,
        });

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: changeDetectorRefSpyObj },
                { provide: DrawingService, useValue: drawingServiceMock },
                { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
                { provide: GridService, useValue: gridServiceSpyObj },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
                { provide: ModalService, useValue: modalServiceSpyObj },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['changeDetectorRef'] = changeDetectorRefSpyObj;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit should subscribe to shortcutService's toggleGrid, increaseGridSize and decreaseGridSize", async(() => {
        toggleGridSubject.next();
        increaseGridSizeSubject.next();
        decreaseGridSizeSubject.next();

        expect(gridServiceSpyObj.toggleDisplay).toHaveBeenCalled();
        expect(gridServiceSpyObj.increaseSize).toHaveBeenCalled();
        expect(gridServiceSpyObj.decreaseSize).toHaveBeenCalled();
    }));

    it("#ngOnInit should subscribe to drawingService's forceDetectChanges", () => {
        forceDetectChangesSubject.next();

        expect(changeDetectorRefSpyObj.detectChanges).toHaveBeenCalled();
    });

    it("#ngAfterViewInit should set DrawingService's rootElement and call reappendStoredElements", () => {
        const expectedDrawingRoot = {} as SVGSVGElement;
        const expectedSvgDrawingContent = {} as SVGGElement;
        const expectedSvgUserInterfaceContent = {} as SVGGElement;

        component['drawingRoot'].nativeElement = expectedDrawingRoot;
        component['svgDrawingContent'].nativeElement = expectedSvgDrawingContent;
        component['svgUserInterfaceContent'].nativeElement = expectedSvgUserInterfaceContent;

        const reappendStoredElementsSpy = spyOn(drawingServiceMock, 'reappendStoredElements');
        const saveDrawingToStorageSpy = spyOn(drawingServiceMock, 'saveDrawingToStorage');

        component.ngAfterViewInit();
        expect(component['drawingService'].drawingRoot).toBe(expectedDrawingRoot);
        expect(component['drawingService'].svgDrawingContent).toBe(expectedSvgDrawingContent);
        expect(component['drawingService'].svgUserInterfaceContent).toBe(expectedSvgUserInterfaceContent);
        expect(reappendStoredElementsSpy).toHaveBeenCalled();
        expect(saveDrawingToStorageSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from its subscriptions', async(() => {
        const forceDetectChangesSubscriptionSpy = spyOn<any>(component['forceDetectChangesSubscription'], 'unsubscribe');
        const toggleGridSubscriptionSpy = spyOn<any>(component['toggleGridSubscription'], 'unsubscribe');
        const increaseGridSizeSubscriptionSpy = spyOn<any>(component['increaseGridSizeSubscription'], 'unsubscribe');
        const decreaseGridSizeSubscriptionSpy = spyOn<any>(component['decreaseGridSizeSubscription'], 'unsubscribe');

        component.ngOnDestroy();
        expect(forceDetectChangesSubscriptionSpy).toHaveBeenCalled();
        expect(toggleGridSubscriptionSpy).toHaveBeenCalled();
        expect(increaseGridSizeSubscriptionSpy).toHaveBeenCalled();
        expect(decreaseGridSizeSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should delete the svg attributes of drawingService and call onToolDeselection of the currentTool', () => {
        component.ngOnDestroy();
        expect(currentToolSpyObj.onToolDeselection).toHaveBeenCalled();
        expect(component['drawingService'].drawingRoot).toBeUndefined();
        expect(component['drawingService'].svgDrawingContent).toBeUndefined();
        expect(component['drawingService'].svgUserInterfaceContent).toBeUndefined();
    });

    it("#onMouseMove should forward HostListener events to CurrentToolService's onMouseMove if isModalPresent in modalService is false", () => {
        component.onMouseMove({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseMove).toHaveBeenCalled();
    });

    it("#onMouseMove should not forward HostListener events to CurrentToolService's onMouseMove if isModalPresent in modalService is true", () => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: true,
        });
        component['modalService'] = modalServiceSpyObj;
        component.onMouseMove({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseMove).not.toHaveBeenCalled();
    });

    it("#onMouseDown should forward HostListener events to CurrentToolService's onMouseDown if isModalPresent in modalService is false", () => {
        component.onMouseDown({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseDown).toHaveBeenCalled();
    });

    it("#onMouseDown should not forward HostListener events to CurrentToolService's onMouseDown if isModalPresent in modalService is true", () => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: true,
        });
        component['modalService'] = modalServiceSpyObj;
        component.onMouseDown({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseDown).not.toHaveBeenCalled();
    });

    it("#onMouseUp should forward HostListener events to CurrentToolService's onMouseUp if isModalPresent in modalService is false", () => {
        component.onMouseUp({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseUp).toHaveBeenCalled();
    });

    it("#onMouseUp should not forward HostListener events to CurrentToolService's onMouseUp if isModalPresent in modalService is true", () => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: true,
        });
        component['modalService'] = modalServiceSpyObj;
        component.onMouseUp({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseUp).not.toHaveBeenCalled();
    });

    it("#onScroll should forward HostListener events to CurrentToolService's onScroll if isModalPresent in modalService is false", () => {
        component.onScroll({} as WheelEvent);
        expect(currentToolServiceSpyObj.onScroll).toHaveBeenCalled();
    });

    it("#onScroll should not forward HostListener events to CurrentToolService's onScroll if isModalPresent in modalService is true", () => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: true,
        });
        component['modalService'] = modalServiceSpyObj;
        component.onScroll({} as WheelEvent);
        expect(currentToolServiceSpyObj.onScroll).not.toHaveBeenCalled();
    });

    it('#onTouchMove should convert the event using TouchService and forward it to #onMouseMove', () => {
        const onMouseMoveSpy = spyOn(component, 'onMouseMove');
        const toucheServiceSpy = spyOn(TouchService, 'getMouseEventFromTouchEvent');
        component.onTouchMove({} as TouchEvent);
        expect(onMouseMoveSpy).toHaveBeenCalled();
        expect(toucheServiceSpy).toHaveBeenCalled();
    });

    it('#onTouchStart should convert the event using TouchService and forward it to #onMouseDown and #onMouseEnter', () => {
        const onMouseDownSpy = spyOn(component, 'onMouseDown');
        const onMouseEnterSpy = spyOn(component, 'onMouseEnter');
        const toucheServiceSpy = spyOn(TouchService, 'getMouseEventFromTouchEvent');
        component.onTouchStart({} as TouchEvent);
        expect(onMouseDownSpy).toHaveBeenCalled();
        expect(onMouseEnterSpy).toHaveBeenCalled();
        expect(toucheServiceSpy).toHaveBeenCalled();
    });

    it('#onTouchEnd should convert the event using TouchService and forward it to #onMouseUp and #onMouseLeave', () => {
        const onMouseUpSpy = spyOn(component, 'onMouseUp');
        const onMouseLeaveSpy = spyOn(component, 'onMouseLeave');
        const toucheServiceSpy = spyOn(TouchService, 'getMouseEventFromTouchEvent');
        component.onTouchEnd({} as TouchEvent);
        expect(onMouseUpSpy).toHaveBeenCalled();
        expect(onMouseLeaveSpy).toHaveBeenCalled();
        expect(toucheServiceSpy).toHaveBeenCalled();
    });

    it("#onMouseDoubleClick should forward HostListener events to CurrentToolService's onMouseDoubleClick if isModalPresent in modalService is false", () => {
        component.onMouseDoubleClick({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseDoubleClick).toHaveBeenCalled();
    });

    it("#onMouseDoubleClick should not forward HostListener events to CurrentToolService's onMouseDoubleClick if isModalPresent in modalService is true", () => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: true,
        });
        component['modalService'] = modalServiceSpyObj;
        component.onMouseDoubleClick({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseDoubleClick).not.toHaveBeenCalled();
    });

    it("#onKeyDown should forward HostListener events to CurrentToolService's onKeyDown if isModalPresent in modalService is false", () => {
        component.onKeyDown({} as KeyboardEvent);
        expect(currentToolServiceSpyObj.onKeyDown).toHaveBeenCalled();
    });

    it("#onKeyDown should not forward HostListener events to CurrentToolService's onKeyDown if isModalPresent in modalService is true", () => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: true,
        });
        component['modalService'] = modalServiceSpyObj;
        component.onKeyDown({} as KeyboardEvent);
        expect(currentToolServiceSpyObj.onKeyDown).not.toHaveBeenCalled();
    });

    it("#onKeyUp should forward HostListener events to CurrentToolService's onKeyUp if isModalPresent in modalService is false", () => {
        component.onKeyUp({} as KeyboardEvent);
        expect(currentToolServiceSpyObj.onKeyUp).toHaveBeenCalled();
    });

    it("#onKeyUp should not forward HostListener events to CurrentToolService's onKeyUp if isModalPresent in modalService is true", () => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: true,
        });
        component['modalService'] = modalServiceSpyObj;
        component.onKeyUp({} as KeyboardEvent);
        expect(currentToolServiceSpyObj.onKeyUp).not.toHaveBeenCalled();
    });

    it("#onMouseEnter should forward HostListener events to CurrentToolService's onMouseEnter", () => {
        component.onMouseEnter({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseEnter).toHaveBeenCalled();
    });

    it("#onMouseLeave should forward HostListener events to CurrentToolService's onMouseLeave", () => {
        component.onMouseLeave({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseLeave).toHaveBeenCalled();
    });
});
