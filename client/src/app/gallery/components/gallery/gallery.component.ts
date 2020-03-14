import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
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
    containers: SvgFileContainer[] = [];
    searchLabels: string[] = [];
    isLoaded = false;

    galleryFormGroup = new FormGroup({
        labelForm: new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]),
    });

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        private drawingSerializerService: DrawingSerializerService,
        private serverService: ServerService,
        private snackBar: MatSnackBar,
        private drawingService: DrawingService,
    ) {}

    ngOnInit(): void {
        this.getAllDrawings();
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        const control = this.galleryFormGroup.controls.labelForm;

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

    removeLabel(label: string): void {
        const index = this.searchLabels.indexOf(label, 0);
        const control = this.galleryFormGroup.controls.labelForm;

        if (index >= 0) {
            this.searchLabels.splice(index, 1);
        }

        control.markAsDirty();
    }

    hasSearchLabel(container: SvgFileContainer): boolean {
        if (this.searchLabels.length === 0) {
            return true;
        }

        for (const label of container.labels) {
            for (const searchLabel of this.searchLabels) {
                if (label === searchLabel) {
                    return true;
                }
            }
        }
        return false;
    }

    deleteDrawing(selectedContainer: SvgFileContainer): void {
        const confirmationMessage =
            'Attention! La suppression du dessin est irréversible. ' + 'Désirez-vous quand même supprimer le dessin?';
        if (!confirm(confirmationMessage)) {
            return;
        }
        this.serverService.deleteDrawing(selectedContainer).subscribe(() => {
            this.getAllDrawings();
        });
        this.snackBar.open(`Dessin supprimé : ${selectedContainer.title}`, undefined, {
            duration: 4000,
        });
    }

    loadDrawing(selectedContainer: SvgFileContainer): void {
        const confirmationMessage =
            'Attention! Un dessin non-vide est déjà présent sur la zone de travail. ' +
            'Désirez-vous charger le dessin et abandonner vos changements?';
        if (this.drawingService.isDrawingStarted() && !confirm(confirmationMessage)) {
            return;
        }
        this.drawingSerializerService.loadSvgDrawing(selectedContainer);
        this.snackBar.open(`Dessin chargé : ${selectedContainer.title}`, undefined, {
            duration: 4000,
        });
    }

    private getAllDrawings(): void {
        this.serverService.getAllDrawings().subscribe((savedFiles: SavedFile[]): void => {
            this.containers = [];
            for (const savedFile of savedFiles) {
                this.containers.push(this.drawingSerializerService.convertSavedFileToSvgFileContainer(savedFile));
            }
            this.isLoaded = true;
        });
    }

    protected getLabelError(): string {
        return this.galleryFormGroup.controls.labelForm.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.galleryFormGroup.controls.labelForm.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : '';
    }
}
