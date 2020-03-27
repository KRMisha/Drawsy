import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';

describe('DrawingPreviewComponent', () => {
    let component: DrawingPreviewComponent;
    let fixture: ComponentFixture<DrawingPreviewComponent>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let drawingPreviewServiceSpyObj: jasmine.SpyObj<DrawingPreviewService>;

    beforeEach(async(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue('rgba(1, 1, 1, 1)');
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            backgroundColor: colorSpyObj,
        });
        drawingPreviewServiceSpyObj = jasmine.createSpyObj('DrawingPreviewService', ['initializePreview']);
        TestBed.configureTestingModule({
            declarations: [DrawingPreviewComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: DrawingPreviewService, useValue: drawingPreviewServiceSpyObj },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
