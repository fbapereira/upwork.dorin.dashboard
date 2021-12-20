import { TestBed } from '@angular/core/testing';

import { SmartbillService } from './smartbill.service';

describe('SmartbillService', () => {
  let service: SmartbillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartbillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
