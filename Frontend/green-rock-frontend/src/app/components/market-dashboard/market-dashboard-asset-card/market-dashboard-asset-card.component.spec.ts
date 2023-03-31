import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDashboardAssetCardComponent } from './market-dashboard-asset-card.component';

describe('MarketDashboardAssetCardComponent', () => {
  let component: MarketDashboardAssetCardComponent;
  let fixture: ComponentFixture<MarketDashboardAssetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketDashboardAssetCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketDashboardAssetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
