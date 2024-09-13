import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPatternTypeComponent } from './select-pattern-type.component';

describe('SelectPatternTypeComponent', () => {
  let component: SelectPatternTypeComponent;
  let fixture: ComponentFixture<SelectPatternTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPatternTypeComponent]
    });
    fixture = TestBed.createComponent(SelectPatternTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
