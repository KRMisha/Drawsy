import { Type } from '@angular/core';
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

export interface GuideNode {
    name: string;
    children?: GuideNode[];
    guide?: Type<any>; // tslint:disable-line: no-any
}

export const guideData: GuideNode[] = [
    {
        name: 'Bienvenue',
        guide: GuideWelcomeComponent,
    },
    {
        name: 'Outils',
        children: [
            {
                name: 'Outils de traçage',
                children: [
                    { name: 'Aérosol', guide: GuideSpraypaintComponent },
                    { name: 'Crayon', guide: GuidePencilComponent },
                    { name: 'Pinceau', guide: GuidePaintbrushComponent },
                    { name: 'Plume', guide: GuideCalligraphyComponent },
                ],
            },
            {
                name: 'Formes',
                children: [
                    { name: 'Ellipse', guide: GuideEllipseComponent },
                    { name: 'Polygone', guide: GuidePolygonComponent },
                    { name: 'Rectangle', guide: GuideRectangleComponent },
                ],
            },
            { name: 'Applicateur de couleur', guide: GuideRecolorComponent },
            { name: 'Couleur', guide: GuideColorComponent },
            { name: 'Efface', guide: GuideEraserComponent },
            { name: 'Étampe', guide: GuideStampComponent },
            { name: 'Ligne', guide: GuideLineComponent },
            { name: 'Pipette', guide: GuideColorPickerComponent },
            { name: 'Seau de peinture', guide: GuideFillComponent },
            { name: 'Texte', guide: GuideTextComponent },
            { name: 'Sélection', guide: GuideSelectComponent },
        ],
    },
    {
        name: 'Surface de dessin',
        children: [
            { name: 'Grille', guide: GuideGridComponent },
            { name: 'Magnétisme', guide: GuideSnapToGridComponent },
        ],
    },
    {
        name: 'Option de fichiers',
        children: [
            { name: 'Exporter le dessin', guide: GuideExportDrawingComponent },
            { name: 'Sauvegarder le dessin', guide: GuideSaveDrawingComponent },
        ],
    },
];
