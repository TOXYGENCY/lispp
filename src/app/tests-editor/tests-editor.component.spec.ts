import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsEditorComponent } from './tests-editor.component';

describe('TestsEditorComponent', () => {
  let component: TestsEditorComponent;
  let fixture: ComponentFixture<TestsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
