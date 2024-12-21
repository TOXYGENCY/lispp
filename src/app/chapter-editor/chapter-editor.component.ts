import { ApiChaptersService } from "../api-services/chapters/api-chapters.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { Chapter } from '../domain-models/Chapter';
import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from "primeng/api";
import { finalize } from "rxjs";


@Component({
  selector: 'app-chapter-editor',
  standalone: true,
  imports: [
    StyleClassModule, InputTextModule, FormsModule,
    CommonModule, SelectButtonModule,
    DropdownModule, ToastModule, ButtonModule
  ],
  templateUrl: './chapter-editor.component.html',
  styleUrl: './chapter-editor.component.scss'
})


export class ChapterEditorComponent implements OnInit {

  constructor(private apiChaptersService: ApiChaptersService, private messageService: MessageService) { }

  selectedChapter: Chapter | null = null;
  chapters: Chapter[] = [];
  chapter: Chapter | undefined;
  inputFields: any[] = [];
  inputValues: any = {
    chapterTitle: ''
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
        id: 'chapterTitle',
        title: 'Название главы',
        placeholder: 'Введите название главы'
      }
    ];
  }

  ShowSuccessToast(message: string = 'Выполнено успешно.') {
    this.messageService.add({ severity: 'success', summary: 'Успех', detail: message });
  }

  ShowFailToast(message: string = 'Неизвестная ошибка.') {
    this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: message });
  }

  InsertTitle() {
    if (this.selectedChapter) {
      this.inputValues['chapterTitle'] = this.selectedChapter.title; // Обновляем значение поля ввода при выборе главы
    }
  }

  VerifyForm(): boolean {
    if (!this.mode && !this.selectedChapter) {
      this.ShowFailToast("Выберите главу для редактирования.");
      return false;
    }

    if (!this.inputValues['chapterTitle']) {
      this.ShowFailToast("Введите название главы.");
      return false;
    }
    return true;
  }

  onInputChange() {
    // console.log(this.inputValues['chapterTitle']);
  }


  LoadChapters() {
    console.log("Loading chapters...");
    this.apiChaptersService.GetAllChapters().subscribe(
      (response: Chapter[]) => {
        console.log(response);
        this.chapters = response;
      },
      error => {
        this.ShowFailToast("Ошибка при загрузке глав. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  DeleteChapter() {
    if (!this.VerifyForm()) return;
    this.disableSubmit = true;
    this.showLoadingDelete = true;

    console.log("Deleting chapter: " + this.selectedChapter!.id!);
    this.apiChaptersService.DeleteChapter(this.selectedChapter!.id!).pipe(
      finalize(() => {
        this.showLoadingDelete = false; // Устанавливаем состояние загрузки в false
        this.disableSubmit = false; // Включаем кнопку отправки
      })
    ).subscribe(
      (response: any) => {
        this.LoadChapters();
        this.ShowSuccessToast("Глава \"" + this.inputValues['chapterTitle'] + "\" удалена.");
        this.selectedChapter = null;
        this.inputValues['chapterTitle'] = '';
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при удалении главы. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  AddChapter() {
    this.apiChaptersService.AddChapter(this.inputValues['chapterTitle']).pipe(
      finalize(() => {
        this.showLoading = false; 
        this.disableSubmit = false; 
      })
    ).subscribe(
      (response: any) => {
        // this.ShowSuccessToast("Глава \"" + this.inputValues['chapterTitle'] + "\" добавлена.");
        this.ShowSuccessToast(response.message);
        this.LoadChapters();
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при добавлении главы. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  UpdateChapter() {
    const NewChapter = { id: this.selectedChapter!.id, title: this.inputValues['chapterTitle'] }

    this.apiChaptersService.UpdateChapter(NewChapter).pipe(
      finalize(() => {
        this.showLoading = false;
        this.disableSubmit = false;
      })
    ).subscribe(
      (response: any) => {
        this.ShowSuccessToast("Глава обновлена на \"" + this.inputValues['chapterTitle'] + "\".");
        this.LoadChapters();
        this.selectedChapter = null;
        this.inputValues['chapterTitle'] = '';
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при обновлении главы. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  Submit() {
    if (!this.VerifyForm()) return;
    this.showLoading = true;
    this.disableSubmit = true;

    if (this.mode) {
      this.AddChapter();
    } else {
      this.UpdateChapter();
    }

  }
}
