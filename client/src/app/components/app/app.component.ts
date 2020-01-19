import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tool } from 'src/app/classes/tools/tool';
import { InputLogger } from 'src/app/classes/tools/input-logger';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');

    tool: Tool = new InputLogger();

    constructor() {
    }
}
