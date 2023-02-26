import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericErrorMessageComponent } from './generic-error-message.component';

describe('GenericErrorMessageComponent', () => {
  let component: GenericErrorMessageComponent;
  let fixture: ComponentFixture<GenericErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericErrorMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
