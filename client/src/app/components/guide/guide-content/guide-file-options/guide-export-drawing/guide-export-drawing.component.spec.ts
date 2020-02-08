import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideExportDrawingComponent } from './guide-export-drawing.component';

describe('GuideExportDrawingComponent', () => {
    let component: GuideExportDrawingComponent;
    let fixture: ComponentFixture<GuideExportDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideExportDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
