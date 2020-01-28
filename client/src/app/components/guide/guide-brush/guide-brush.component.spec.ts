import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideBrushComponent } from './guide-brush.component';

describe('GuideBrushComponent', () => {
    let component: GuideBrushComponent;
    let fixture: ComponentFixture<GuideBrushComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideBrushComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideBrushComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
