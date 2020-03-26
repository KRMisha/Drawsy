import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SettingsComponent } from '@app/modals/components/settings/settings/settings.component';
import { Color } from '@app/shared/classes/color';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsComponent],
            providers: [{ provide: DrawingService, useValue: ({ backgroundColor: {} as Color } as unknown) as DrawingService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // fit("#confirmColor should update DrawingService's color", () => {
    //     spyOn(component, 'confirmColor').and.callThrough();
    //     component.color = { red: 10, blue: 10, green: 20, alpha: 0.1 } as Color;
    //     component.confirmColor();
    //     expect(component.confirmColor).toHaveBeenCalled();
    //     const drawingService = TestBed.inject(DrawingService);
    //     expect(drawingService.backgroundColor).toEqual({ red: 10, blue: 10, green: 20, alpha: 0.1 } as Color);
    // });
});
