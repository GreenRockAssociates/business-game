import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAnalysisComponent } from './asset-analysis.component';

describe('AssetAnalysisComponent', () => {
  let component: AssetAnalysisComponent;
  let fixture: ComponentFixture<AssetAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
