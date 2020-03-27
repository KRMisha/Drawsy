import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideGalleryComponent } from '@app/guide/components/guide-content/guide-drawing-management/guide-gallery/guide-gallery.component';

describe('GuideGalleryComponent', () => {
    let component: GuideGalleryComponent;
    let fixture: ComponentFixture<GuideGalleryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideGalleryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideGalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
