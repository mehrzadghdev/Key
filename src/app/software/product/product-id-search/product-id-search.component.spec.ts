import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIdSearchComponent } from './product-id-search.component';

describe('ProductIdSearchComponent', () => {
  let component: ProductIdSearchComponent;
  let fixture: ComponentFixture<ProductIdSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductIdSearchComponent]
    });
    fixture = TestBed.createComponent(ProductIdSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
