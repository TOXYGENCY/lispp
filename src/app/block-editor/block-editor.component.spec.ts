import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockEditorComponent } from './block-editor.component';

describe('BlockEditorComponent', () => {
  let component: BlockEditorComponent;
  let fixture: ComponentFixture<BlockEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
