import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideUndoRedoComponent } from './guide-undo-redo.component';

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
