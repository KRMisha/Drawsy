// tslint:disable: max-line-length
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideUndoRedoComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-undo-redo/guide-undo-redo.component';
// tslint:enable: max-line-length

describe('GuideUndoRedoComponent', () => {
    let component: GuideUndoRedoComponent;
    let fixture: ComponentFixture<GuideUndoRedoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideUndoRedoComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideUndoRedoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
