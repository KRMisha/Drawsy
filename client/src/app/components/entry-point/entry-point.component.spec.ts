import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EntryPointComponent } from './entry-point.component';

describe('EntryPointComponent', () => {
    let component: EntryPointComponent;
    let fixture: ComponentFixture<EntryPointComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EntryPointComponent],
            imports: [MatSidenavModule, MatCardModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
