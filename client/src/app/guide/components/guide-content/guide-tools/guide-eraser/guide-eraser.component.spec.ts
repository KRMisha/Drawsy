import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideEraserComponent } from './guide-eraser.component';

describe('GuideEraserComponent', () => {
    let component: GuideEraserComponent;
    let fixture: ComponentFixture<GuideEraserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideEraserComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideEraserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
