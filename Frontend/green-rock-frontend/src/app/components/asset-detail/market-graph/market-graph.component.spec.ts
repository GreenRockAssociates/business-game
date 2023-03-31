import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketGraphComponent } from './market-graph.component';

describe('MarketGraphComponent', () => {
  let component: MarketGraphComponent;
  let fixture: ComponentFixture<MarketGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
