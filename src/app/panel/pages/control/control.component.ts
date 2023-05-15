import { Component } from '@angular/core';
import { PanelService } from '../../services/panel.service';
import { FormBuilder } from '@angular/forms';
import { ControlService } from '../../services/control.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent {

  constructor(private panelService: PanelService,private fb: FormBuilder,
    private controlService: ControlService) {


      
    }

}
