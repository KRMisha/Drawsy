import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDrawingComponent } from './import-drawing.component';

describe('ImportDrawingComponent', () => {
    let component: ImportDrawingComponent;
    let fixture: ComponentFixture<ImportDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImportDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
