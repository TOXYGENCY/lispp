import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ApiBlocksService } from '../api-services/blocks/api-blocks.service';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Block } from '../domain-models/Block';
import { ButtonModule } from 'primeng/button';
import { ApiChaptersService } from '../api-services/chapters/api-chapters.service';
import { ApiParagraphsService } from '../api-services/paragraphs/api-paragraphs.service';
import { Paragraph } from '../domain-models/Paragraph'; 
import { EditorModule } from 'primeng/editor';


@Component({
  selector: 'app-paragraph-editor',
  standalone: true,
  imports: [
    StyleClassModule, InputTextModule, FormsModule,
    CommonModule, SelectButtonModule,
    DropdownModule, ToastModule, ButtonModule,
    EditorModule, 
  ],
  providers: [MessageService],
  templateUrl: './paragraph-editor.component.html',
  styleUrl: './paragraph-editor.component.scss'
})
export class ParagraphEditorComponent implements OnInit {

  constructor(private apiBlocksService: ApiBlocksService, 
    private apiParagraphsService: ApiParagraphsService, 
    private messageService: MessageService) { }

  selectedParagraph: Paragraph | null = null;
  paragraphs: Paragraph[] = [];
  paragraph: Paragraph | undefined; 
  paragraphDescriptionText: string = '';
  paragraphDescriptionSpecial: string = '';

  selectedBlock: Block | null = null;
  blocks: Block[] = [];
  block: Block | undefined;

  inputFields: any[] = [];
  inputValues: any = {
    paragraphTitle: '',
    paragraphDescriptionContent: '',
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
        id: 'paragraphTitle',
        title: 'Название параграфа',
        placeholder: 'Введите название параграфа'
      }
    ];
  }

  ShowSuccessToast(message: string = 'Выполнено успешно.') {
    this.messageService.add({ severity: 'success', summary: 'Успех', detail: message });
  }

  ShowFailToast(message: string = 'Неизвестная ошибка.') {
    this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: message });
  }

  FieldsReset(onlyText: boolean = false) {
    this.inputValues['paragraphTitle'] = '';
    this.inputValues['paragraphDescriptionContent'] = '';
    if (!onlyText) {
      this.selectedParagraph = null;
      this.selectedBlock = null;
    }
  }

  InsertTitle() {
    if (this.selectedParagraph) {
      this.inputValues['paragraphTitle'] = this.selectedParagraph.title; // Обновляем значение поля ввода при выборе параграфа
    }
  }

  VerifyForm(): boolean {
    if (!this.mode) {
      if (!this.selectedParagraph) {
        this.ShowFailToast("Выберите параграф для редактирования.");
        return false;
      }
      if (!this.selectedBlock) {
        this.ShowFailToast("Прикрепите параграф к блоку.");
        return false;
      }
    }

    if (!this.inputValues['paragraphTitle']) {
      this.ShowFailToast("Введите название параграфа.");
      return false;
    }
    return true;
  }

  onInputChange() {
    setTimeout(() => {
      const nbsp = String.fromCharCode(160);
      this.paragraphDescriptionSpecial = this.inputValues['paragraphDescriptionContent'].replace(/&nbsp;/g, ' ');
      this.paragraphDescriptionText = this._GetTextFromHtml(this.paragraphDescriptionSpecial);
      console.log(this.paragraphDescriptionSpecial);
    }, 100);
    
  }

  private _GetTextFromHtml(html: string): string {
    const _tempElement = document.createElement('div'); // Создаем временный элемент
    _tempElement.innerHTML = html; // Устанавливаем HTML-контент
    const _text = _tempElement.innerText; // Получаем текстовое содержимое
    _tempElement.remove(); // Удаляем временный элемент из DOM
    return _text; // Возвращаем текст
  }

  SetParagraph() {
    if (this.selectedParagraph) {
      this.inputValues['paragraphTitle'] = this.selectedParagraph.title; // Обновляем значение поля ввода при выборе параграфа
      this.inputValues['paragraphDescriptionContent'] = this.selectedParagraph.description_special; // Обновляем значение поля ввода при выборе параграфа
      this.apiParagraphsService.GetLinkedBlock(this.selectedParagraph.id!).subscribe(
        (response: any) => {

          this.selectedBlock = response;
          this.LoadBlocks();
        },
        (error: any) => {
          this.ShowFailToast("Ошибка при загрузке блока параграфа. Попробуйте позже.");
          console.error(error);
        }
      );
    }
  }

  LoadBlocks() {
    console.log("Loading blocks...");
    this.apiBlocksService.GetAllBlocks().subscribe(
      (response: Block[]) => {
        console.log(response);
        this.blocks = response;
      },
      (error: any) => {
        this.ShowFailToast("Ошибка при загрузке блоков. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  LoadParagraphs() {
    console.log("Loading paragraphs...");
    this.apiParagraphsService.GetAllParagraphs().subscribe(
      (response: Paragraph[]) => {
        console.log(response);
        this.paragraphs = response;
      },
      error => {
        this.ShowFailToast("Ошибка при загрузке параграфа. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  DeleteParagraph() {
    if (!this.VerifyForm()) return;
    this.disableSubmit = true;
    this.showLoadingDelete = true;

    console.log("Deleting paragraph: " + this.selectedParagraph!.id!);
    this.apiParagraphsService.DeleteParagraph(this.selectedParagraph!.id!).pipe(
      finalize(() => {
        this.showLoadingDelete = false; // Устанавливаем состояние загрузки в false
        this.disableSubmit = false; // Включаем кнопку отправки
      })
    ).subscribe(
      (response: any) => {
        this.LoadParagraphs();
        this.ShowSuccessToast("Параграф \"" + this.inputValues['paragraphTitle'] + "\" удален.");
        this.FieldsReset();
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при удалении параграфа. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  AddParagraph() {
    const NewParagraph = { title: this.inputValues['paragraphTitle'], description_text: this.paragraphDescriptionText, 
      description_special: this.paragraphDescriptionSpecial }

    this.apiParagraphsService.AddParagraph(NewParagraph, this.selectedBlock!.id!).pipe(
      finalize(() => {
        this.showLoading = false;
        this.disableSubmit = false;
      })
    ).subscribe(
      (response: any) => {
        this.ShowSuccessToast(response.message);
        this.FieldsReset(true);
        this.LoadParagraphs();
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при добавлении параграфа. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  UpdateParagraph() {
    const NewParagraph = { id: this.selectedParagraph!.id, title: this.inputValues['paragraphTitle'], 
      description_text: this.paragraphDescriptionText, description_special: this.paragraphDescriptionSpecial }

    this.apiParagraphsService.UpdateParagraph(NewParagraph, this.selectedBlock!.id!).pipe(
      finalize(() => {
        this.showLoading = false;
        this.disableSubmit = false;
      })
    ).subscribe(
      (response: any) => {
        this.ShowSuccessToast("Параграф обновлен на \"" + this.inputValues['paragraphTitle'] + "\".");
        this.LoadParagraphs();
        this.FieldsReset();
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при обновлении параграфа. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  Submit() {
    if (!this.VerifyForm()) return;
    this.showLoading = true;
    this.disableSubmit = true;

    if (this.mode) {
      this.AddParagraph();
    } else {
      this.UpdateParagraph();
    }

  }
}
