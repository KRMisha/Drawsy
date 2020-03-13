import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { ServerService } from '@app/server/service/server-service.service';
import { SavedFile } from '../../../../../../common/communication/saved-file';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    containers: SvgFileContainer[] = [];
    searchLabels: string[] = [];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingSerializerService: DrawingSerializerService, private serverService: ServerService) {}
    ngOnInit(): void {
        this.getAllDrawings();
    }

    // createSvgFileContainer(): void {
    //     this.containers = this.serverService.getAllDrawings();
    // }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.searchLabels.push(value.trim());
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    removeLabel(label: string): void {
        const index = this.searchLabels.indexOf(label, 0);

        if (index >= 0) {
            this.searchLabels.splice(index, 1);
        }
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

    private getAllDrawings(): void {
        this.serverService.getAllDrawings().subscribe((messages: SavedFile[]): void => {
            for (const message of messages) {
                this.containers.push(this.drawingSerializerService.convertSavedFileToSvgFileContainer(message));
            }
        });
    }
}
