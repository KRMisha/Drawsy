import { Component, OnInit } from '@angular/core';
import { GridService } from '@app/drawing/services/grid.service';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
    icon = 'grid_off';

    constructor(private gridService: GridService) {}

    ngOnInit(): void {
        this.selectIcon();
    }

    selectIcon(): void {
        this.gridService.isDisplayed ? (this.icon = 'grid_off') : (this.icon = 'grid_on');
    }
}
