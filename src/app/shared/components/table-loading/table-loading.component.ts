import { Component, Input } from '@angular/core';

@Component({
  selector: 'key-table-loading',
  templateUrl: './table-loading.component.html',
  styleUrls: ['./table-loading.component.scss']
})
export class TableLoadingComponent {
  @Input('columns')
  public columns: string[] = ['ردیف 1', 'ردیف 2', 'ردیف 3', 'ردیف 4', 'ردیف 5', 'ردیف 6', 'ردیف 7'];
  @Input('rows')
  public rows: number = 10;

  get rowsToLoop(): null[] {
    return new Array(this.rows).fill(null);
  }
}
