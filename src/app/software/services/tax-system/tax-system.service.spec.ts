import { TestBed } from '@angular/core/testing';

import { TaxSystemService } from './tax-system.service';

describe('TaxSystemService', () => {
  let service: TaxSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
