// tslint:disable: max-line-length
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideExportDrawingComponent } from '@app/guide/components/guide-content/guide-drawing-management/guide-export-drawing/guide-export-drawing.component';
import { GuideGalleryComponent } from '@app/guide/components/guide-content/guide-drawing-management/guide-gallery/guide-gallery.component';
import { GuideSaveDrawingComponent } from '@app/guide/components/guide-content/guide-drawing-management/guide-save-drawing/guide-save-drawing.component';
import { GuideGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideUndoRedoComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-undo-redo/guide-undo-redo.component';
import { GuideCalligraphyComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePaintbrushComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSprayCanComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-spray-can/guide-spray-can.component';
import { GuideClipboardComponent } from '@app/guide/components/guide-content/guide-tools/guide-clipboard/guide-clipboard.component';
import { GuideColorPickerComponent } from '@app/guide/components/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from '@app/guide/components/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from '@app/guide/components/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from '@app/guide/components/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from '@app/guide/components/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from '@app/guide/components/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectionComponent } from '@app/guide/components/guide-content/guide-tools/guide-selection/guide-selection.component';
import { GuideEllipseComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from '@app/guide/components/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from '@app/guide/components/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from '@app/guide/components/guide-content/guide-welcome/guide-welcome.component';
// tslint:enable: max-line-length

// Leaf nodes
const guideWelcomeNode: GuideNode = { name: 'Bienvenue', guide: GuideWelcomeComponent, previousGuideNode: undefined };

const guideSprayCanNode: GuideNode = { name: 'Aérosol', guide: GuideSprayCanComponent, previousGuideNode: guideWelcomeNode };
const guidePencilNode: GuideNode = { name: 'Crayon', guide: GuidePencilComponent, previousGuideNode: guideSprayCanNode };
const guidePaintbrushNode: GuideNode = { name: 'Pinceau', guide: GuidePaintbrushComponent, previousGuideNode: guidePencilNode };
const guideCalligraphyNode: GuideNode = { name: 'Plume', guide: GuideCalligraphyComponent, previousGuideNode: guidePaintbrushNode };

const guideEllipseNode: GuideNode = { name: 'Ellipse', guide: GuideEllipseComponent, previousGuideNode: guideCalligraphyNode };
const guidePolygonNode: GuideNode = { name: 'Polygone', guide: GuidePolygonComponent, previousGuideNode: guideEllipseNode };
const guideRectangleNode: GuideNode = { name: 'Rectangle', guide: GuideRectangleComponent, previousGuideNode: guidePolygonNode };

const guideRecolorNode: GuideNode = { name: 'Applicateur de couleur', guide: GuideRecolorComponent, previousGuideNode: guideRectangleNode };
const guideColorNode: GuideNode = { name: 'Couleur', guide: GuideColorComponent, previousGuideNode: guideRecolorNode };
const guideEraserNode: GuideNode = { name: 'Efface', guide: GuideEraserComponent, previousGuideNode: guideColorNode };
const guideStampNode: GuideNode = { name: 'Étampe', guide: GuideStampComponent, previousGuideNode: guideEraserNode };
const guideLineNode: GuideNode = { name: 'Ligne', guide: GuideLineComponent, previousGuideNode: guideStampNode };
const guideColorPickerNode: GuideNode = { name: 'Pipette', guide: GuideColorPickerComponent, previousGuideNode: guideLineNode };
const guideClipboardNode: GuideNode = { name: 'Presse-papier', guide: GuideClipboardComponent, previousGuideNode: guideColorPickerNode };
const guideFillNode: GuideNode = { name: 'Seau de peinture', guide: GuideFillComponent, previousGuideNode: guideClipboardNode };
const guideTextNode: GuideNode = { name: 'Texte', guide: GuideTextComponent, previousGuideNode: guideFillNode };
const guideSelectionNode: GuideNode = { name: 'Sélection', guide: GuideSelectionComponent, previousGuideNode: guideTextNode };

const guideUndoRedoNode: GuideNode = { name: 'Annuler-refaire', guide: GuideUndoRedoComponent, previousGuideNode: guideSelectionNode };
const guideGridNode: GuideNode = { name: 'Grille', guide: GuideGridComponent, previousGuideNode: guideUndoRedoNode };
const guideSnapToGridNode: GuideNode = { name: 'Magnétisme', guide: GuideSnapToGridComponent, previousGuideNode: guideGridNode };

const guideExportDrawingNode: GuideNode = {
    name: 'Exporter le dessin',
    guide: GuideExportDrawingComponent,
    previousGuideNode: guideSnapToGridNode,
};
const guideGalleryNode: GuideNode = {
    name: 'Galerie de dessins',
    guide: GuideGalleryComponent,
    previousGuideNode: guideExportDrawingNode,
};
const guideSaveDrawingNode: GuideNode = {
    name: 'Sauvegarder le dessin',
    guide: GuideSaveDrawingComponent,
    previousGuideNode: guideGalleryNode,
};

guideWelcomeNode.nextGuideNode = guideSprayCanNode;
guideSprayCanNode.nextGuideNode = guidePencilNode;
guidePencilNode.nextGuideNode = guidePaintbrushNode;
guidePaintbrushNode.nextGuideNode = guideCalligraphyNode;
guideCalligraphyNode.nextGuideNode = guideEllipseNode;
guideEllipseNode.nextGuideNode = guidePolygonNode;
guidePolygonNode.nextGuideNode = guideRectangleNode;
guideRectangleNode.nextGuideNode = guideRecolorNode;
guideRecolorNode.nextGuideNode = guideColorNode;
guideColorNode.nextGuideNode = guideEraserNode;
guideEraserNode.nextGuideNode = guideStampNode;
guideStampNode.nextGuideNode = guideLineNode;
guideLineNode.nextGuideNode = guideColorPickerNode;
guideColorPickerNode.nextGuideNode = guideClipboardNode;
guideClipboardNode.nextGuideNode = guideFillNode;
guideFillNode.nextGuideNode = guideTextNode;
guideTextNode.nextGuideNode = guideSelectionNode;
guideSelectionNode.nextGuideNode = guideUndoRedoNode;
guideUndoRedoNode.nextGuideNode = guideSnapToGridNode;
guideGridNode.nextGuideNode = guideSnapToGridNode;
guideSnapToGridNode.nextGuideNode = guideExportDrawingNode;
guideExportDrawingNode.nextGuideNode = guideGalleryNode;
guideGalleryNode.nextGuideNode = guideSaveDrawingNode;
guideSaveDrawingNode.nextGuideNode = undefined;

// Groups
const guideBrushToolsNode: GuideNode = {
    name: 'Outils de traçage',
    children: [guideSprayCanNode, guidePencilNode, guidePaintbrushNode, guideCalligraphyNode],
};
const guideShapeToolsNode: GuideNode = { name: 'Formes', children: [guideEllipseNode, guidePolygonNode, guideRectangleNode] };
const guideToolsNode: GuideNode = {
    name: 'Outils',
    children: [
        guideBrushToolsNode,
        guideShapeToolsNode,
        guideRecolorNode,
        guideColorNode,
        guideEraserNode,
        guideStampNode,
        guideLineNode,
        guideColorPickerNode,
        guideClipboardNode,
        guideFillNode,
        guideTextNode,
        guideSelectionNode,
    ],
};
const guideDrawingOptionsNode = { name: 'Surface de dessin', children: [guideUndoRedoNode, guideGridNode, guideSnapToGridNode] };
const guideFileOptionsNode = { name: 'Gestion des dessins', children: [guideExportDrawingNode, guideGalleryNode, guideSaveDrawingNode] };

// Top-level tree structure
export const guideData: GuideNode[] = [guideWelcomeNode, guideToolsNode, guideDrawingOptionsNode, guideFileOptionsNode];
