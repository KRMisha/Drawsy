import { Injectable, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { GuideBrushComponent } from '../../components/guide/guide-brush/guide-brush.component';
import { GuideColorComponent } from '../../components/guide/guide-color/guide-color.component';
import { GuideExportDrawingComponent } from '../../components/guide/guide-export-drawing/guide-export-drawing.component';
import { GuideLineComponent } from '../../components/guide/guide-line/guide-line.component';
import { GuidePencilComponent } from '../../components/guide/guide-pencil/guide-pencil.component';
import { GuideRectangleComponent } from '../../components/guide/guide-rectangle/guide-rectangle.component';
import { GuideSaveDrawingComponent } from '../../components/guide/guide-save-drawing/guide-save-drawing.component';
import { GuideWelcomeComponent } from '../../components/guide/guide-welcome/guide-welcome.component';

const guides: Type<any>[] = [GuideWelcomeComponent, GuidePencilComponent, GuideBrushComponent,
                             GuideLineComponent, GuideRectangleComponent, GuideColorComponent,
                             GuideExportDrawingComponent, GuideSaveDrawingComponent];

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
