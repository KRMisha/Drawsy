import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { ServerService } from '@app/server/services/server.service';
import { SavedFile } from '../../../../../../common/communication/saved-file';
import { descRegex } from '../../../../../../common/validation/desc-regex';

const maxInputStringLength = 15;

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    drawings: SvgFileContainer[] = [];
    searchLabels: string[] = [];
    isLoaded = false;

    galleryGroup = new FormGroup({
        labels: new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]),
    });

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        private router: Router,
        private drawingSerializerService: DrawingSerializerService,
        private serverService: ServerService,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.getAllDrawings();
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        const control = this.galleryGroup.controls.labels;

        if ((value || '').trim()) {
            control.setErrors(null);
            control.setValue(value);
            if (control.valid) {
                control.markAsDirty();
                input.value = '';
                this.searchLabels.push(value.trim());
            }
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    getDrawingsWithLabels(): SvgFileContainer[] {
        if (this.searchLabels.length === 0) {
            return this.drawings;
        }

        return this.drawings.filter((drawing: SvgFileContainer) =>
            drawing.labels.some((label: string) => this.searchLabels.includes(label)),
        );
    }

    removeLabel(label: string): void {
        const index = this.searchLabels.indexOf(label, 0);
        const control = this.galleryGroup.controls.labels;

        if (index >= 0) {
            this.searchLabels.splice(index, 1);
        }

        control.markAsDirty();
    }

    deleteDrawing(selectedDrawing: SvgFileContainer): void {
        const confirmationMessage = 'Attention! La suppression du dessin est irréversible. Désirez-vous quand même supprimer le dessin?';
        if (!confirm(confirmationMessage)) {
            return;
        }

        this.serverService.deleteDrawing(selectedDrawing.id).subscribe(() => {
            this.getAllDrawings(); // TODO: move to gallery service
        });
        this.snackBar.open(`Dessin supprimé : ${selectedDrawing.title}`, undefined, {
            duration: 4000,
        });
    }

    loadDrawing(selectedDrawing: SvgFileContainer): void {
        if (this.drawingSerializerService.loadSvgDrawing(selectedDrawing)) {
            this.snackBar.open(`Dessin chargé : ${selectedDrawing.title}`, undefined, {
                duration: 4000,
            });
            this.router.navigate(['/editor']);
        }
    }

    getLabelError(): string {
        return this.galleryGroup.controls.labels.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.galleryGroup.controls.labels.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : '';
    }

    private getAllDrawings(): void {
        this.serverService.getAllDrawings().subscribe((savedFiles: SavedFile[]): void => {
            this.drawings = [];
            for (const savedFile of savedFiles) {
                this.drawings.push(this.drawingSerializerService.convertSavedFileToSvgFileContainer(savedFile));
            }
            this.isLoaded = true;
        });
    }
}
