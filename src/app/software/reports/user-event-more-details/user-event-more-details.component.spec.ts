import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventMoreDetailsComponent } from './user-event-more-details.component';

describe('UserEventMoreDetailsComponent', () => {
  let component: UserEventMoreDetailsComponent;
  let fixture: ComponentFixture<UserEventMoreDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEventMoreDetailsComponent]
    });
    fixture = TestBed.createComponent(UserEventMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
