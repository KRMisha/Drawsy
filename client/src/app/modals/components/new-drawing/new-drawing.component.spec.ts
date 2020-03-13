import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';

// tslint:disable: max-classes-per-file
// tslint:disable: no-magic-numbers
// tslint:disable: no-empty

class MockDrawingService {
    isDrawingStarted: boolean;
    clearStoredElements = () => {};
}

// class MockWindow {
//     innerWidth: number;
//     innerHeight: number;
// }

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let drawingServiceMock: MockDrawingService;

    beforeEach(async(() => {
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        drawingServiceMock = new MockDrawingService();

        TestBed.configureTestingModule({
            declarations: [NewDrawingComponent],
            imports: [FormsModule, MatCardModule, MatIconModule, ReactiveFormsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceMock },
                { provide: Router, useValue: routerSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.backgroundColor = new Color();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // START NOTE: MOVE THESE TESTS TO DRAWING SERVICE!

    it('#onSubmit should create a new drawing if no drawing is started', () => {
        spyOn(drawingServiceMock, 'clearStoredElements').and.callThrough();
        drawingServiceMock.isDrawingStarted = false;

        component.onSubmit();
        expect(drawingServiceMock.clearStoredElements).toHaveBeenCalled();
        expect(routerSpyObj.navigate).toHaveBeenCalled();
    });

    it('#onSubmit should do nothing if a drawing is started and user cancels its action', () => {
        spyOn(window, 'confirm').and.returnValue(false);

        spyOn(drawingServiceMock, 'clearStoredElements').and.callThrough();
        drawingServiceMock.isDrawingStarted = true;

        component.onSubmit();
        expect(drawingServiceMock.clearStoredElements).not.toHaveBeenCalled();
        expect(routerSpyObj.navigate).not.toHaveBeenCalled();
    });

    it('#onSubmit should create a new drawing if a drawing is started and user confirms its action', () => {
        spyOn(window, 'confirm').and.returnValue(true);

        spyOn(drawingServiceMock, 'clearStoredElements').and.callThrough();
        drawingServiceMock.isDrawingStarted = true;

        component.onSubmit();
        expect(drawingServiceMock.clearStoredElements).toHaveBeenCalled();
        expect(routerSpyObj.navigate).toHaveBeenCalled();
    });

    // END NOTE

    // it('should remember the dimensions were modified if they were modified manually', () => {
    //     component.drawingForm.controls.width.setValue(123);
    //     expect(component.wereDimensionsModified).toBe(true);

    //     component.wereDimensionsModified = false;
    //     component.drawingForm.controls.height.setValue(456);
    //     expect(component.wereDimensionsModified).toBe(true);
    // });

    // it('should not remember the dimensions were modified if they were not modified manually', () => {
    //     component.drawingForm.controls.width.setValue(123, { emitEvent: false });
    //     expect(component.wereDimensionsModified).toBe(false);

    //     component.wereDimensionsModified = false;
    //     component.drawingForm.controls.height.setValue(456, { emitEvent: false });
    //     expect(component.wereDimensionsModified).toBe(false);
    // });

    // it('#onResize should update drawing dimensions if they were never modified manually', () => {
    //     component.drawingForm.controls.width.setValue(123);
    //     component.drawingForm.controls.height.setValue(456);
    //     component.wereDimensionsModified = false;

    //     const mockWindow = new MockWindow();
    //     mockWindow.innerWidth = 1337;
    //     mockWindow.innerHeight = 1337;
    //     component.onResize({ target: (mockWindow as unknown) as EventTarget } as Event);

    //     expect(component.drawingForm.controls.width.value).not.toBe(123);
    //     expect(component.drawingForm.controls.height.value).not.toBe(456);
    // });

    // it('#onResize should not update drawing dimensions if they were modified manually', () => {
    //     component.drawingForm.controls.width.setValue(123);
    //     component.drawingForm.controls.height.setValue(456);
    //     component.wereDimensionsModified = true;

    //     const mockWindow = new MockWindow();
    //     mockWindow.innerWidth = 1337;
    //     mockWindow.innerHeight = 1337;
    //     component.onResize({ target: (mockWindow as unknown) as EventTarget } as Event);

    //     expect(component.drawingForm.controls.width.value).toBe(123);
    //     expect(component.drawingForm.controls.height.value).toBe(456);
    // });
});
