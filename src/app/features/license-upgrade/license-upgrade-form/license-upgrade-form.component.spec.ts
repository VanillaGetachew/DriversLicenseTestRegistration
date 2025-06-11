import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUpgradeFormComponent } from './license-upgrade-form.component';

describe('LicenseUpgradeFormComponent', () => {
  let component: LicenseUpgradeFormComponent;
  let fixture: ComponentFixture<LicenseUpgradeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseUpgradeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseUpgradeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
