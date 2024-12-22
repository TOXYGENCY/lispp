import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphEditorComponent } from './paragraph-editor.component';

describe('ParagraphEditorComponent', () => {
  let component: ParagraphEditorComponent;
  let fixture: ComponentFixture<ParagraphEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParagraphEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
