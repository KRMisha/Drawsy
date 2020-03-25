import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-undo-redo',
    templateUrl: './guide-undo-redo.component.html',
    styleUrls: ['../../shared.scss', './guide-undo-redo.component.scss'],
})
export class GuideUndoRedoComponent implements GuideContent {}
