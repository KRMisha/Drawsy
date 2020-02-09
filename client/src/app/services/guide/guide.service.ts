import { Injectable, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { GuideBrushComponent } from '../../components/guide/guide-content/guide-tools/guide-brushes/guide-brush/guide-brush.component';
import { GuideColorComponent } from '../../components/guide/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideExportDrawingComponent } from '../../components/guide/guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideLineComponent } from '../../components/guide/guide-content/guide-tools/guide-line/guide-line.component';
import { GuidePencilComponent } from '../../components/guide/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideRectangleComponent } from '../../components/guide/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideSaveDrawingComponent } from '../../components/guide/guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideWelcomeComponent } from '../../components/guide/guide-content/guide-welcome/guide-welcome.component';
import { GuideSpraypaintComponent } from '../../components/guide/guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideSnapToGridComponent } from '../../components/guide/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideSelectComponent } from '../../components/guide/guide-content/guide-tools/guide-select/guide-select.component';
import { GuideGridComponent } from '../../components/guide/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideTextComponent } from '../../components/guide/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideFillComponent } from '../../components/guide/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideColorPickerComponent } from '../../components/guide/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideStampComponent } from '../../components/guide/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideEraserComponent } from '../../components/guide/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideRecolorComponent } from '../../components/guide/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuidePolygonComponent } from '../../components/guide/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideEllipseComponent } from '../../components/guide/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuideCalligraphyComponent } from '../../components/guide/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';

const guides: Type<any>[] = [
    GuideWelcomeComponent,
    GuideSpraypaintComponent,
    GuidePencilComponent,
    GuideBrushComponent,
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
    private shouldOpenAllMenus = new Subject<boolean>();

    getGuides(): Type<any>[] {
        return guides;
    }

    openAllCollapseMenus(): Observable<boolean> {
        this.shouldOpenAllMenus.next(true);
        return this.shouldOpenAllMenus.asObservable();
    }
}
