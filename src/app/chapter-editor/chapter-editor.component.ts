import { Component, OnInit } from '@angular/core';
import { Chapter } from '../domain-models/Chapter';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-chapter-editor',
  standalone: true,
  imports: [
    CheckboxModule, StyleClassModule,
    ButtonModule, InputTextModule, FormsModule,
    CommonModule, ReactiveFormsModule,
    SelectButtonModule, SelectButtonModule
  ],
  templateUrl: './chapter-editor.component.html',
  styleUrl: './chapter-editor.component.scss'
})
export class ChapterEditorComponent implements OnInit {
  chapter: Chapter | undefined;
  modes: any[] = [];
  mode: boolean = true;
  
  
  ngOnInit(): void {
    this.modes = [
      { label: "Добавить", mode: true, icon: "pi pi-plus" },
      { label: "Редактировать", mode: false, icon: "pi pi-pencil" }
    ]
  }

}
