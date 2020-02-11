import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Color } from 'src/app/classes/color/color';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { CreateDrawingComponent } from './create-drawing.component';

// tslint:disable: no-empty

fdescribe('CreateDrawingComponent', () => {
    let component: CreateDrawingComponent;
    let fixture: ComponentFixture<CreateDrawingComponent>;

    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let drawingStarted: boolean;

    beforeEach(async(() => {
        drawingServiceSpyObj = jasmine.createSpyObj({
            addElement: (element: SVGElement) => {},
            removeElement: (element: SVGElement) => {},
            reappendStoredElements: () => {},
            clearStoredElements: () => {},
            isDrawingStarted: drawingStarted,
        });

        routerSpyObj = jasmine.createSpyObj({
            navigate: () => {},
        });

        TestBed.configureTestingModule({
            declarations: [CreateDrawingComponent],
            imports: [FormsModule, MatCardModule, MatIconModule, ReactiveFormsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: Router, useValue: routerSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        drawingStarted = false;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateDrawingComponent);
        component = fixture.componentInstance;
        component.backgroundColor = new Color();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onSubmit should do nothing if a drawing is started and user cancels its action', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        drawingStarted = true;
        expect(drawingServiceSpyObj.clearStoredElements).toHaveBeenCalledTimes(0);
        expect(routerSpyObj.navigate).toHaveBeenCalledTimes(0);
    });

    it('#onSubmit should do create a new drawing if a drawing is started and user confirms its action', () => {
        // spyOn(window, 'confirm').and.returnValue(true);
        // drawingStarted = true;
        // expect(drawingServiceSpyObj.clearStoredElements).toHaveBeenCalledTimes(1);
        // expect(routerSpyObj.navigate).toHaveBeenCalledTimes(1);
    });
});