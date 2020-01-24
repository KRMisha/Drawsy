import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPointComponent } from './entry-point.component';

describe('EntryPointComponent', () => {
    let component: EntryPointComponent;
    let fixture: ComponentFixture<EntryPointComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EntryPointComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EntryPointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
