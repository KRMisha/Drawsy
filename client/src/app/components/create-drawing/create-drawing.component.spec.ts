import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Color } from 'src/app/classes/color/color';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { CreateDrawingComponent } from './create-drawing.component';

describe('CreateDrawingComponent', () => {
    let component: CreateDrawingComponent;
    let fixture: ComponentFixture<CreateDrawingComponent>;

    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<CreateDrawingComponent>>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    beforeEach(async(() => {
        dialogRefSpyObj = jasmine.createSpyObj({
            afterClosed: of({}),
            afterOpened: of({}),
            open: null,
            close: null,
        });

        drawingServiceSpyObj = jasmine.createSpyObj({ '': '' });
        routerSpyObj = jasmine.createSpyObj({ '': '' });
        TestBed.configureTestingModule({
            declarations: [CreateDrawingComponent],
            imports: [FormsModule, MatCardModule, MatIconModule, ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: Router, useValue: routerSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
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
});
