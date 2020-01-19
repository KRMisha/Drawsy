import { Component} from '@angular/core';
import { Button, BUTTONS } from '../button/button-data'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  buttons: Button[] = BUTTONS;
}
