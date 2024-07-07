import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptDeleteComponent } from './accept-delete.component';

describe('AcceptDeleteComponent', () => {
  let component: AcceptDeleteComponent;
  let fixture: ComponentFixture<AcceptDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptDeleteComponent]
    });
    fixture = TestBed.createComponent(AcceptDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
