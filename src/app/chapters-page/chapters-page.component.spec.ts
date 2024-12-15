import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaptersPageComponent } from './chapters-page.component';

describe('ChaptersPageComponent', () => {
  let component: ChaptersPageComponent;
  let fixture: ComponentFixture<ChaptersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChaptersPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChaptersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
