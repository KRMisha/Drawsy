import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelColorComponent } from './color-field.component';

describe('PanelColorComponent', () => {
    let component: PanelColorComponent;
    let fixture: ComponentFixture<PanelColorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PanelColorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PanelColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
