import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportDrawingComponent } from '@app/modals/components/import-export-drawing/import-export-drawing.component';

describe('ImportExportDrawingComponent', () => {
    let component: ImportExportDrawingComponent;
    let fixture: ComponentFixture<ImportExportDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImportExportDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
