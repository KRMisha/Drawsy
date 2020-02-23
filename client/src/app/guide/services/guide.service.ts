import { Injectable, Type } from '@angular/core';

// Disable max line length for long imports due to detailed nesting
// tslint:disable: max-line-length
import { GuideGridComponent } from '../components/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from '../components/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideExportDrawingComponent } from '../components/guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from '../components/guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideCalligraphyComponent } from '../components/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePaintbrushComponent } from '../components/guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from '../components/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSpraypaintComponent } from '../components/guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideColorPickerComponent } from '../components/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from '../components/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from '../components/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from '../components/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from '../components/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from '../components/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectComponent } from '../components/guide-content/guide-tools/guide-select/guide-select.component';
import { GuideEllipseComponent } from '../components/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from '../components/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from '../components/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from '../components/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from '../components/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from '../components/guide-content/guide-welcome/guide-welcome.component';
// tslint:enable: max-line-length

// Type<any> to prevent all components needing to inherit from a parent component
// tslint:disable-next-line: no-any
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

@Injectable({
    providedIn: 'root',
})
export class GuideService {
    // tslint:disable-next-line: no-any
    getGuides(): Type<any>[] {
        return guides;
    }
}
