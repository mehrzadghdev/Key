import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, RendererStyleFlags2, SimpleChanges } from '@angular/core';
import { Subject, BehaviorSubject, combineLatest, mapTo, map, takeUntil } from 'rxjs';

@Directive({
  selector: '[keyTiledTable]'
})
export class TiledTableDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input('tiledTable')
  public set tailedTable(value: boolean) {
    if (value) {
      this.renderer.addClass(this.table.nativeElement, 'mat-mdc-tiled-table');
    }
    else {
      this.renderer.removeClass(this.table.nativeElement, 'mat-mdc-tiled-table');
    }
  }

  private onDestroy$ = new Subject<boolean>();

  private thead!: HTMLTableSectionElement;
  private tbody!: HTMLTableSectionElement;

  private theadChanged$ = new BehaviorSubject(true);
  private tbodyChanged$ = new Subject<boolean>();

  private theadObserver = new MutationObserver(() =>
    this.theadChanged$.next(true)
  );
  private tbodyObserver = new MutationObserver(() =>
    this.tbodyChanged$.next(true)
  );

  constructor(private table: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.thead = this.table.nativeElement.querySelector('thead');
    this.tbody = this.table.nativeElement.querySelector('tbody');

    this.theadObserver.observe(this.thead, {
      characterData: true,
      subtree: true
    });
    this.tbodyObserver.observe(this.tbody, { childList: true });
  }

  ngAfterViewInit() {
    /**
     * Set the "data-column-name" attribute for every body row cell, either on
     * thead row changes (e.g. language changes) or tbody rows changes (add, delete).
     */

    this.tbody.querySelectorAll('tr').forEach(tr => {
      this.renderer.setStyle(
        tr,
        'height',
        'auto',
        RendererStyleFlags2.Important
      )
    })
    combineLatest([this.theadChanged$, this.tbodyChanged$])
      .pipe(
        mapTo({ headRow: this.thead.rows.item(0)!, bodyRows: this.tbody.rows }),
        map(({ headRow, bodyRows }) => ({
          columnNames: [...headRow.children].map(
            headerCell => headerCell.textContent!
          ),
          rows: [...bodyRows].map(row => [...row.children])
        })),
        takeUntil(this.onDestroy$)
      )
      .subscribe(({ columnNames, rows }) => {
        rows.forEach(rowCells => {
          rowCells.forEach(cell => {
            this.renderer.setAttribute(
              cell,
              'data-column-name',
              columnNames[(cell as HTMLTableCellElement).cellIndex]
            );
          })
        })
      });
  }

  ngOnDestroy(): void {
    this.theadObserver.disconnect();
    this.tbodyObserver.disconnect();

    this.onDestroy$.next(true);
  }
}
