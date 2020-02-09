import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingSettingsComponent } from './drawing-settings.component';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('DrawingSettingsComponent', () => {
    let component: DrawingSettingsComponent;
    let fixture: ComponentFixture<DrawingSettingsComponent>;
    let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<DrawingSettingsComponent>>
    beforeEach(async(() => {
        dialogRefSpyObj = jasmine.createSpyObj({
            afterClosed: of({}),
            afterOpened: of({}),
            open: null,
            close: null,
        });

        TestBed.configureTestingModule({
            declarations: [DrawingSettingsComponent],
            providers: [{ provide: MatDialogRef, useValue: dialogRefSpyObj }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
