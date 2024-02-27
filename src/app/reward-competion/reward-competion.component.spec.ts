import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardCompetionComponent } from './reward-competion.component';

describe('RewardCompetionComponent', () => {
  let component: RewardCompetionComponent;
  let fixture: ComponentFixture<RewardCompetionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardCompetionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardCompetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
