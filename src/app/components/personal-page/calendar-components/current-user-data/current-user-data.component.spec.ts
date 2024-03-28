import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUserDataComponent } from './current-user-data.component';

describe('CurrentUserDataComponent', () => {
  let component: CurrentUserDataComponent;
  let fixture: ComponentFixture<CurrentUserDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentUserDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
