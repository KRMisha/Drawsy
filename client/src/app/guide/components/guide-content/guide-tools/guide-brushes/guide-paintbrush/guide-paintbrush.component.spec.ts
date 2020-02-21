import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuidePaintbrushComponent } from './guide-paintbrush.component';

describe('GuidePaintbrushComponent', () => {
    let component: GuidePaintbrushComponent;
    let fixture: ComponentFixture<GuidePaintbrushComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuidePaintbrushComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuidePaintbrushComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
