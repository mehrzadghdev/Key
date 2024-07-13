import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceProductComponent } from './add-invoice-product.component';

describe('AddInvoiceProductComponent', () => {
  let component: AddInvoiceProductComponent;
  let fixture: ComponentFixture<AddInvoiceProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInvoiceProductComponent]
    });
    fixture = TestBed.createComponent(AddInvoiceProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
