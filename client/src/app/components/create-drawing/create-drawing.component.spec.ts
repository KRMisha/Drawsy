import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { CreateDrawingComponent } from './create-drawing.component';

describe('CreateDrawingComponent', () => {
    let component: CreateDrawingComponent;
    let fixture: ComponentFixture<CreateDrawingComponent>;
    
    beforeEach(async(() => {
        let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<CreateDrawingComponent>>;
        dialogRefSpyObj = jasmine.createSpyObj({
            afterClosed: of({}),
            afterOpened: of({}),
            open: null,
            close: null,
        });
        TestBed.configureTestingModule({
            declarations: [CreateDrawingComponent],
            imports: [FormsModule, MatCardModule, MatIconModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
