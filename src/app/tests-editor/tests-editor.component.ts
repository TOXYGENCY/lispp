import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-tests-editor',
  standalone: true,
  imports: [
    StyleClassModule, InputTextModule, FormsModule,
    CommonModule, SelectButtonModule,
    DropdownModule, ToastModule, ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './tests-editor.component.html',
  styleUrl: './tests-editor.component.scss'
})
export class TestsEditorComponent implements OnInit {
  Submit() {
    throw new Error('Method not implemented.');
  }

  inputFields: any[] = [];
  inputValues: any = {
    testTitle: '',
    questionText: '',
    answer1Text: '',
    answer2Text: '',
    answer3Text: '',
    answer4Text: '',
  };
  modes: any[] = [];
  mode: boolean = true;
  showLoading: boolean = false;
  showLoadingDelete: boolean = false;
  disableSubmit: boolean = false;
  submitLabel: string = 'Подтвердить';


  ngOnInit(): void {
    this.modes = [
      { label: "Добавить", mode: true, icon: "pi pi-plus" },
      { label: "Редактировать", mode: false, icon: "pi pi-pencil" }
    ];

    this.inputFields = [
      {
        id: 'testTitle',
        title: 'Название теста',
        placeholder: 'Введите название теста'
      },
      {
        id: 'questionText',
        title: 'Вопрос',
        placeholder: 'Введите текст вопроса'
      },
      { name: 'answer1Text', title: 'Ответ 1', placeholder: 'Вариант ответа 1', isCorrect: false },
      { name: 'answer2Text', title: 'Ответ 2', placeholder: 'Вариант ответа 2', isCorrect: false },
      { name: 'answer3Text', title: 'Ответ 3', placeholder: 'Вариант ответа 3', isCorrect: false },
      { name: 'answer4Text', title: 'Ответ 4', placeholder: 'Вариант ответа 4', isCorrect: false },
    ];
  }

}