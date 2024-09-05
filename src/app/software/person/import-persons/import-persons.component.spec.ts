import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPersonsComponent } from './import-persons.component';

describe('ImportPersonsComponent', () => {
  let component: ImportPersonsComponent;
  let fixture: ComponentFixture<ImportPersonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportPersonsComponent]
    });
    fixture = TestBed.createComponent(ImportPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
