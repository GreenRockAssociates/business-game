import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationsListComponent } from './invitations-list.component';

describe('InvitationsComponent', () => {
  let component: InvitationsListComponent;
  let fixture: ComponentFixture<InvitationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
