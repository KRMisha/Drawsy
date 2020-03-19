import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GuideService } from '@app/guide/services/guide.service';

// Disable max line length for long imports due to detailed nesting
// tslint:disable: max-line-length
import { GuideGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideExportDrawingComponent } from '@app/guide/components/guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from '@app/guide/components/guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideCalligraphyComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePaintbrushComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSpraypaintComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideColorPickerComponent } from '@app/guide/components/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from '@app/guide/components/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from '@app/guide/components/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from '@app/guide/components/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from '@app/guide/components/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from '@app/guide/components/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectComponent } from '@app/guide/components/guide-content/guide-tools/guide-select/guide-select.component';
import { GuideEllipseComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from '@app/guide/components/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from '@app/guide/components/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from '@app/guide/components/guide-content/guide-welcome/guide-welcome.component';
import { GuideContent } from '../classes/guide-content';
// tslint:enable: max-line-length

describe('GuideService', () => {
    const guides: Type<GuideContent>[] = [
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
        service = TestBed.inject(GuideService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getGuides should return an array of components', () => {
        expect(service.getGuides()).toEqual(guides);
    });
});
