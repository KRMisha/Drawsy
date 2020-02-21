import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GuideService } from './guide.service';

// Disable max line length for long imports due to detailed nesting
// tslint:disable: max-line-length
import { GuideGridComponent } from '../guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from '../guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideExportDrawingComponent } from '../guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from '../guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideCalligraphyComponent } from '../guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePaintbrushComponent } from '../guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from '../guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSpraypaintComponent } from '../guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideColorPickerComponent } from '../guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from '../guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from '../guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from '../guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from '../guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from '../guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectComponent } from '../guide-content/guide-tools/guide-select/guide-select.component';
import { GuideEllipseComponent } from '../guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from '../guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from '../guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from '../guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from '../guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from '../guide-content/guide-welcome/guide-welcome.component';
// tslint:enable: max-line-length

describe('GuideService', () => {
    const guides: Type<any>[] = [
        GuideWelcomeComponent,
        GuideSpraypaintComponent,
        GuidePencilComponent,
        GuidePaintbrushComponent,
        GuideCalligraphyComponent,
        GuideEllipseComponent,
        GuidePolygonComponent,
        GuideRectangleComponent,
        GuideRecolorComponent,
        GuideColorComponent,
        GuideEraserComponent,
        GuideStampComponent,
        GuideLineComponent,
        GuideColorPickerComponent,
        GuideFillComponent,
        GuideTextComponent,
        GuideSelectComponent,
        GuideGridComponent,
        GuideSnapToGridComponent,
        GuideExportDrawingComponent,
        GuideSaveDrawingComponent,
    ];

    let service: GuideService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(GuideService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getGuides should return an array of components', () => {
        expect(service.getGuides()).toEqual(guides);
    });
});
