import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideSnapToGridComponent } from './guide-snap-to-grid.component';

describe('GuideSnapToGridComponent', () => {
    let component: GuideSnapToGridComponent;
    let fixture: ComponentFixture<GuideSnapToGridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSnapToGridComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSnapToGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
