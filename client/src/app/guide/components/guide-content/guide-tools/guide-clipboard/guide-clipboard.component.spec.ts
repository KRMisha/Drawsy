import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideClipboardComponent } from '@app/guide/components/guide-content/guide-tools/guide-clipboard/guide-clipboard.component';

describe('GuideClipboardComponent', () => {
    let component: GuideClipboardComponent;
    let fixture: ComponentFixture<GuideClipboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideClipboardComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideClipboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
