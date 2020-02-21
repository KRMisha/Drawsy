import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideFillComponent } from './guide-fill.component';

describe('GuideFillComponent', () => {
    let component: GuideFillComponent;
    let fixture: ComponentFixture<GuideFillComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideFillComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideFillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
