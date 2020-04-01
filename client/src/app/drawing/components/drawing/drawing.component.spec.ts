import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ModalService } from '@app/modals/services/modal.service';
import { Color } from '@app/shared/classes/color';
import { SvgClickEvent } from '@app/shared/classes/svg-click-event';
import { Vec2 } from '@app/shared/classes/vec2';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subject } from 'rxjs';

// tslint:disable: max-line-length
// tslint:disable: no-string-literal
// tslint:disable: no-any

class ColorMock {
    toRgbaString = () => 'rgba(69, 69, 69, 1)';
}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;
    let gridServiceSpyObj: jasmine.SpyObj<GridService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;
    let modalServiceSpyObj: jasmine.SpyObj<ModalService>;
    let colorSpyObj: jasmine.SpyObj<Color>;

    const toggleGridSubject = new Subject<Color>();
    const increaseGridSizeSubject = new Subject<Color>();
    const decreaseGridSizeSubject = new Subject<SvgClickEvent>();

    const returnedDimensions: Vec2 = { x: 10, y: 10 };
    beforeEach(async(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue('rgba(1, 1, 1, 1)');
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['reappendStoredElements'], {
            drawingRoot: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            svgDrawingContent: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            svgUserInterfaceContent: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            dimensions: returnedDimensions,
            backgroundColor: colorSpyObj,
        });
        drawingServiceSpyObj.backgroundColor = new ColorMock() as Color;

        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [
            'afterDrawingInit',
            'setRenderer',
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseDoubleClick',
            'onKeyDown',
            'onKeyUp',
            'onEnter',
            'onLeave',
            'setMouseDown',
            'setMouseInsideDrawing',
        ]);

        gridServiceSpyObj = jasmine.createSpyObj('GridService', ['toggleDisplay', 'increaseSize', 'decreaseSize'], {
            isDisplayEnabled: true,
            size: 10,
            opacity: 1,
        });

        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [], {
            isModalPresent: false,
        });

        shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            toggleGrid$: toggleGridSubject,
            increaseGridSize$: increaseGridSizeSubject,
            decreaseGridSize$: decreaseGridSizeSubject,
        });

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
                { provide: GridService, useValue: gridServiceSpyObj },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
                { provide: ModalService, useValue: modalServiceSpyObj },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit should subscribe to shortcutService's toggleGrid, increaseGridSize and decreaseGridSize", async(() => {
        component.ngOnInit();
        toggleGridSubject.next();
        increaseGridSizeSubject.next();
        decreaseGridSizeSubject.next();

        expect(gridServiceSpyObj.toggleDisplay).toHaveBeenCalled();
        expect(gridServiceSpyObj.increaseSize).toHaveBeenCalled();
        expect(gridServiceSpyObj.decreaseSize).toHaveBeenCalled();
    }));

    it("#ngAfterViewInit should set DrawingService's rootElement and call reappendStoredElements", () => {
        const expectedDrawingRoot = {} as SVGSVGElement;
        const expectedSvgDrawingContent = {} as SVGGElement;
        const expectedSvgUserInterfaceContent = {} as SVGGElement;

        component['drawingRoot'].nativeElement = expectedDrawingRoot;
        component['svgDrawingContent'].nativeElement = expectedSvgDrawingContent;
        component['svgUserInterfaceContent'].nativeElement = expectedSvgUserInterfaceContent;
        const drawingServiceMock = {
            drawingRoot: {} as SVGSVGElement,
            svgDrawingContent: {} as SVGGElement,
            svgUserInterfaceContent: {} as SVGGElement,
            reappendStoredElements(): void {}, // tslint:disable-line: no-empty
        } as DrawingService;
        component['drawingService'] = drawingServiceMock;

        const reappendStoredElementsSpy = spyOn(drawingServiceMock, 'reappendStoredElements');

        component.ngAfterViewInit();

        expect(component['drawingService'].drawingRoot).toBe(expectedDrawingRoot);
        expect(component['drawingService'].svgDrawingContent).toBe(expectedSvgDrawingContent);
        expect(component['drawingService'].svgUserInterfaceContent).toBe(expectedSvgUserInterfaceContent);
        expect(reappendStoredElementsSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from its subscriptions and set the svg attributes of drawingService to undefined', async(() => {
        const toggleGridSubscriptionSpy = spyOn<any>(component['toggleGridSubscription'], 'unsubscribe');
        const increaseGridSizeSubscriptionSpy = spyOn<any>(component['increaseGridSizeSubscription'], 'unsubscribe');
        const decreaseGridSizeSubscriptionSpy = spyOn<any>(component['decreaseGridSizeSubscription'], 'unsubscribe');
        const drawingServiceMock = {
            drawingRoot: {} as SVGSVGElement,
            svgDrawingContent: {} as SVGGElement,
            svgUserInterfaceContent: {} as SVGGElement,
        } as DrawingService;
        component['drawingService'] = drawingServiceMock;
        component.ngOnDestroy();
        expect(toggleGridSubscriptionSpy).toHaveBeenCalled();
        expect(increaseGridSizeSubscriptionSpy).toHaveBeenCalled();
        expect(decreaseGridSizeSubscriptionSpy).toHaveBeenCalled();

        expect(component['drawingService'].drawingRoot).toBeUndefined();
        expect(component['drawingService'].svgDrawingContent).toBeUndefined();
        expect(component['drawingService'].svgUserInterfaceContent).toBeUndefined();
    }));

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

    it("#onEnter should forward HostListener events to CurrentToolService's onEnter", () => {
        component.onEnter({} as MouseEvent);
        expect(currentToolServiceSpyObj.onEnter).toHaveBeenCalled();
    });

    it("#onLeave should forward HostListener events to CurrentToolService's onLeave", () => {
        component.onLeave({} as MouseEvent);
        expect(currentToolServiceSpyObj.onLeave).toHaveBeenCalled();
    });
});
