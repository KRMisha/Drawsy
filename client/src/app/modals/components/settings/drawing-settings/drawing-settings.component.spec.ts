import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingSettingsComponent } from '@app/modals/components/settings/drawing-settings/drawing-settings.component';

describe('DrawingDimensionsSettingsComponent', () => {
    let component: DrawingSettingsComponent;
    let fixture: ComponentFixture<DrawingSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingSettingsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
