import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SidebarDrawerComponent } from '@app/editor/components/sidebar-drawer/sidebar-drawer.component';
import { SidebarComponent } from '@app/editor/components/sidebar/sidebar.component';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { ToolEllipseService } from '@app/tools/services/shapes/tool-ellipse.service';
import { ToolPolygonService } from '@app/tools/services/shapes/tool-polygon.service';
import { ToolRectangleService } from '@app/tools/services/shapes/tool-rectangle.service';
import { Tool } from '@app/tools/services/tool';
import { ToolEraserService } from '@app/tools/services/tool-eraser.service';
import { ToolEyedropperService } from '@app/tools/services/tool-eyedropper.service';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { ToolRecolorService } from '@app/tools/services/tool-recolor.service';
import { ToolSprayCanService } from '@app/tools/services/tool-spray-can.service';
import { Subject } from 'rxjs';

// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;
    let toolHolderServiceSpyObj: jasmine.SpyObj<ToolHolderService>;
    let modalServiceSpyObj: jasmine.SpyObj<ModalService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;
    let sidebarDrawerSpyObj: jasmine.SpyObj<SidebarDrawerComponent>;

    const initialTool = ({} as unknown) as Tool;
    const toolPencilServiceStub = {} as ToolPencilService;
    const toolPaintbrushServiceStub = {} as ToolPaintbrushService;
    const toolLineServiceStub = {} as ToolLineService;
    const toolSprayCanServiceStub = {} as ToolSprayCanService;
    const toolRectangleServiceStub = {} as ToolRectangleService;
    const toolEllipseServiceStub = {} as ToolEllipseService;
    const toolPolygonServiceStub = {} as ToolPolygonService;
    const toolEyedropperServiceStub = {} as ToolEyedropperService;
    const toolRecolorServiceStub = {} as ToolRecolorService;
    const toolSelectionServiceStub = {} as ToolSelectionService;
    const toolEraserServiceStub = {} as ToolEraserService;
    const initialTools = [toolPaintbrushServiceStub, toolEllipseServiceStub];

    let selectToolPencilShortcutSubject: Subject<void>;
    let selectToolPaintbrushShortcutSubject: Subject<void>;
    let selectToolLineShortcutSubject: Subject<void>;
    let selectToolSprayCanShortcutSubject: Subject<void>;
    let selectToolRectangleShortcutSubject: Subject<void>;
    let selectToolEllipseShortcutSubject: Subject<void>;
    let selectToolPolygonShortcutSubject: Subject<void>;
    let selectToolEyedropperShortcutSubject: Subject<void>;
    let selectToolRecolorShortcutSubject: Subject<void>;
    let selectToolSelectionShortcutSubject: Subject<void>;
    let selectToolEraserShortcutSubject: Subject<void>;
    let openExportDrawingShortcutSubject: Subject<void>;
    let openSaveDrawingShortcutSubject: Subject<void>;

    beforeEach(async(() => {
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: initialTool,
        });

        toolHolderServiceSpyObj = jasmine.createSpyObj('ToolHolderService', [], {
            toolPencilService: toolPencilServiceStub,
            toolPaintBrushService: toolPaintbrushServiceStub,
            toolLineService: toolLineServiceStub,
            toolSprayCanService: toolSprayCanServiceStub,
            toolRectangleService: toolRectangleServiceStub,
            toolEllipseService: toolEllipseServiceStub,
            toolPolygonService: toolPolygonServiceStub,
            toolEyedropperService: toolEyedropperServiceStub,
            toolRecolorService: toolRecolorServiceStub,
            toolSelectionService: toolSelectionServiceStub,
            toolEraserService: toolEraserServiceStub,
            tools: initialTools,
        });

        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [
            'openNewDrawingModal',
            'openExportDrawingModal',
            'openSaveDrawingModal',
            'openGalleryModal',
            'openSettingsModal',
            'openGuideModal',
        ]);

        selectToolPencilShortcutSubject = new Subject<void>();
        selectToolPaintbrushShortcutSubject = new Subject<void>();
        selectToolLineShortcutSubject = new Subject<void>();
        selectToolSprayCanShortcutSubject = new Subject<void>();
        selectToolRectangleShortcutSubject = new Subject<void>();
        selectToolEllipseShortcutSubject = new Subject<void>();
        selectToolPolygonShortcutSubject = new Subject<void>();
        selectToolEyedropperShortcutSubject = new Subject<void>();
        selectToolRecolorShortcutSubject = new Subject<void>();
        selectToolSelectionShortcutSubject = new Subject<void>();
        selectToolEraserShortcutSubject = new Subject<void>();
        openExportDrawingShortcutSubject = new Subject<void>();
        openSaveDrawingShortcutSubject = new Subject<void>();
        shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            selectToolPencilShortcut$: selectToolPencilShortcutSubject,
            selectToolPaintbrushShortcut$: selectToolPaintbrushShortcutSubject,
            selectToolLineShortcut$: selectToolLineShortcutSubject,
            selectToolSprayCanShortcut$: selectToolSprayCanShortcutSubject,
            selectToolRectangleShortcut$: selectToolRectangleShortcutSubject,
            selectToolEllipseShortcut$: selectToolEllipseShortcutSubject,
            selectToolPolygonShortcut$: selectToolPolygonShortcutSubject,
            selectToolEyedropperShortcut$: selectToolEyedropperShortcutSubject,
            selectToolRecolorShortcut$: selectToolRecolorShortcutSubject,
            selectToolSelectionShortcut$: selectToolSelectionShortcutSubject,
            selectToolEraserShortcut$: selectToolEraserShortcutSubject,
            openExportDrawingShortcut$: openExportDrawingShortcutSubject,
            openSaveDrawingShortcut$: openSaveDrawingShortcutSubject,
        });

        sidebarDrawerSpyObj = jasmine.createSpyObj('SidebarDrawer', ['resetCurrentControls']);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: Router, useValue: routerSpyObj },
                { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
                { provide: ToolHolderService, useValue: toolHolderServiceSpyObj },
                { provide: ModalService, useValue: modalServiceSpyObj },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['sidebarDrawer'] = sidebarDrawerSpyObj;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit should subscribe to all of shortcutService's tool shortcuts", async(() => {
        const currentToolServiceMock = { currentTool: initialTool } as CurrentToolService;
        component['currentToolService'] = currentToolServiceMock;
        component.ngOnInit();
        selectToolPencilShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolPencilService);
        selectToolPaintbrushShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolPaintbrushService);
        selectToolLineShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolLineService);
        selectToolSprayCanShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolSprayCanService);
        selectToolRectangleShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolRectangleService);
        selectToolEllipseShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolEllipseService);
        selectToolPolygonShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolPolygonService);
        selectToolEyedropperShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolEyedropperService);
        selectToolRecolorShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolRecolorService);
        selectToolSelectionShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolSelectionService);
        selectToolEraserShortcutSubject.next();
        expect(currentToolServiceMock.currentTool).toEqual(toolHolderServiceSpyObj.toolEraserService);
    }));

    it('#ngOnInit should subscribe to the openExportDrawing and openSaveDrawing shortcuts', async(() => {
        component.ngOnInit();
        spyOn(component, 'openExportDrawingModal');
        spyOn(component, 'openSaveDrawingModal');
        openExportDrawingShortcutSubject.next();
        openSaveDrawingShortcutSubject.next();

        expect(component.openExportDrawingModal).toHaveBeenCalled();
        expect(component.openSaveDrawingModal).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should unsubscribe from all of the tool subscriptions', async(() => {
        const pencilSubscriptionSpy = spyOn(component['selectToolPencilShortcutSubscription'], 'unsubscribe');
        const paintbrushSubscriptionSpy = spyOn(component['selectToolPaintbrushShortcutSubscription'], 'unsubscribe');
        const lineSubscriptionSpy = spyOn(component['selectToolLineShortcutSubscription'], 'unsubscribe');
        const spraycanSubscriptionSpy = spyOn(component['selectToolSprayCanShortcutSubscription'], 'unsubscribe');
        const rectangleSubscriptionSpy = spyOn(component['selectToolRectangleShortcutSubscription'], 'unsubscribe');
        const ellipseSubscriptionSpy = spyOn(component['selectToolEllipseShortcutSubscription'], 'unsubscribe');
        const polygonSubscriptionSpy = spyOn(component['selectToolPolygonShortcutSubscription'], 'unsubscribe');
        const eyedropperSubscriptionSpy = spyOn(component['selectToolEyedropperShortcutSubscription'], 'unsubscribe');
        const recolorSubscriptionSpy = spyOn(component['selectToolRecolorShortcutSubscription'], 'unsubscribe');
        const selectionSubscriptionSpy = spyOn(component['selectToolSelectionShortcutSubscription'], 'unsubscribe');
        const eraserSubscriptionSpy = spyOn(component['selectToolEraserShortcutSubscription'], 'unsubscribe');

        component.ngOnDestroy();
        expect(pencilSubscriptionSpy).toHaveBeenCalled();
        expect(paintbrushSubscriptionSpy).toHaveBeenCalled();
        expect(lineSubscriptionSpy).toHaveBeenCalled();
        expect(spraycanSubscriptionSpy).toHaveBeenCalled();
        expect(rectangleSubscriptionSpy).toHaveBeenCalled();
        expect(ellipseSubscriptionSpy).toHaveBeenCalled();
        expect(polygonSubscriptionSpy).toHaveBeenCalled();
        expect(eyedropperSubscriptionSpy).toHaveBeenCalled();
        expect(recolorSubscriptionSpy).toHaveBeenCalled();
        expect(selectionSubscriptionSpy).toHaveBeenCalled();
        expect(eraserSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should unsubscribe from the openSaveDrawing and the openExportDrawing shortcut subscriptions', async(() => {
        const exportDrawingSubscriptionSpy = spyOn(component['exportDrawingShortcutSubscription'], 'unsubscribe');
        const saveDrawingSubscriptionSpy = spyOn(component['saveDrawingShortcutSubscription'], 'unsubscribe');

        component.ngOnDestroy();
        expect(exportDrawingSubscriptionSpy).toHaveBeenCalled();
        expect(saveDrawingSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#openNewDrawingModal should forward the call to modalService', () => {
        component.openNewDrawingModal();
        expect(modalServiceSpyObj.openNewDrawingModal).toHaveBeenCalled();
    });

    it('#openExportDrawingModal should forward the call to modalService', () => {
        component.openExportDrawingModal();
        expect(modalServiceSpyObj.openExportDrawingModal).toHaveBeenCalled();
    });

    it('#openSaveDrawingModal should forward the call to modalService', () => {
        component.openSaveDrawingModal();
        expect(modalServiceSpyObj.openSaveDrawingModal).toHaveBeenCalled();
    });

    it('#openGalleryModal should forward the call to modalService', () => {
        component.openGalleryModal();
        expect(modalServiceSpyObj.openGalleryModal).toHaveBeenCalled();
    });

    it('#openSettingsModal should forward the call to modalService', () => {
        component.openSettingsModal();
        expect(modalServiceSpyObj.openSettingsModal).toHaveBeenCalled();
    });

    it('#openGuideModal should forward the call to modalService', () => {
        component.openGuideModal();
        expect(modalServiceSpyObj.openGuideModal).toHaveBeenCalled();
    });

    it('#navigateToHome should forward the call to the router', () => {
        component.navigateToHome();
        expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/home']);
    });

    it("#get tools should return the toolHolderService's tool array", () => {
        const returnValue = component.tools;
        expect(returnValue).toEqual(initialTools);
    });

    it("#get currentTool should return the currentToolService's current tool", () => {
        const returnValue = component.currentTool;
        expect(returnValue).toEqual(initialTool);
    });

    it('#set CurrentTool should change the current tool of currentToolService and reset the sidebarDrawer\'s controls', () => {
        const currentToolServiceMock = { currentTool: initialTool };
        component.currentTool = toolEyedropperServiceStub;
        expect(currentToolServiceMock.currentTool).toEqual(toolEyedropperServiceStub);
        expect(sidebarDrawerSpyObj.resetCurrentControls).toHaveBeenCalled();
    });
});
