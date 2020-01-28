import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidePencilComponent } from './guide-pencil.component';

describe('GuidePencilComponent', () => {
    let component: GuidePencilComponent;
    let fixture: ComponentFixture<GuidePencilComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuidePencilComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuidePencilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
