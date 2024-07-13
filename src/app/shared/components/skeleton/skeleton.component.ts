import { Component, Input } from '@angular/core';

@Component({
  selector: 'key-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent {
  @Input("width")
  public width: string = '200px';

  @Input("height")
  public height: string = '20px';
}
