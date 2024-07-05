import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'key-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input('loading')
  public loading: boolean = false;

  @Input('disabled')
  public disabled: boolean = false;

  @Input('appearance')
  public appearance: 'stroked' | 'raised' | 'primary' | 'flat' | 'error' | 'text' = 'primary'

  @Input('content')
  public content: 'icon' | 'text' = 'text';

  @Input('type') 
  public type: 'submit' | 'button' = 'button';
  
  @Input('block')
  public block: boolean = false;
}
