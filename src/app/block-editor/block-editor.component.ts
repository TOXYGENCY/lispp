import { Component } from '@angular/core';
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
import { Chapter } from '../domain-models/Chapter';
import { ApiChaptersService } from '../api-services/chapters/api-chapters.service';

@Component({
  selector: 'app-block-editor',
  standalone: true,
  imports: [
    StyleClassModule, InputTextModule, FormsModule,
    CommonModule, SelectButtonModule,
    DropdownModule, ToastModule, ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './block-editor.component.html',
  styleUrl: './block-editor.component.scss'
})
export class BlockEditorComponent {

  constructor(private apiBlocksService: ApiBlocksService, private apiChaptersService: ApiChaptersService, private messageService: MessageService) { }

  selectedBlock: Block | null = null;
  blocks: Block[] = [];
  block: Block | undefined;
  selectedChapter: Chapter | null = null;
  chapters: Chapter[] = [];
  chapter: Chapter | undefined;
  inputFields: any[] = [];
  inputValues: any = {
    blockTitle: ''
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
        id: 'blockTitle',
        title: 'Название блока',
        placeholder: 'Введите название блока'
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
    if (this.selectedBlock) {
      this.inputValues['blockTitle'] = this.selectedBlock.title; // Обновляем значение поля ввода при выборе блока
    }
  }

  VerifyForm(): boolean {
    if (!this.mode) {
      if (!this.selectedBlock) {
        this.ShowFailToast("Выберите блок для редактирования.");
        return false;
      }
      if (!this.selectedChapter) {
        this.ShowFailToast("Прикрепите блок к главе.");
        return false;
      }
    }

    if (!this.inputValues['blockTitle']) {
      this.ShowFailToast("Введите название блока.");
      return false;
    }
    return true;
  }

  onInputChange() {
    // console.log(this.inputValues['blockTitle']);
  }

  SetBlock(){
    if (this.selectedBlock) {
      this.inputValues['blockTitle'] = this.selectedBlock.title; // Обновляем значение поля ввода при выборе блока
      this.apiBlocksService.GetLinkedChapter(this.selectedBlock.id!).subscribe(
        (response: any) => {
          this.selectedChapter = response;
          this.LoadChapters();
        },
        (error: any) => {
          this.ShowFailToast("Ошибка при загрузке главы блока. Попробуйте позже.");
          console.error(error);
        }
      );
    }
  }

  LoadChapters() {
    console.log("Loading chapters...");
    this.apiChaptersService.GetAllChapters().subscribe(
      (response: Chapter[]) => {
        console.log(response);
        this.chapters = response;
      },
      (error: any) => {
        this.ShowFailToast("Ошибка при загрузке глав. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  LoadBlocks() {
    console.log("Loading blocks...");
    this.apiBlocksService.GetAllBlocks().subscribe(
      (response: Block[]) => {
        console.log(response);
        this.blocks = response;
      },
      error => {
        this.ShowFailToast("Ошибка при загрузке блока. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  DeleteBlock() {
    if (!this.VerifyForm()) return;
    this.disableSubmit = true;
    this.showLoadingDelete = true;

    console.log("Deleting block: " + this.selectedBlock!.id!);
    this.apiBlocksService.DeleteBlock(this.selectedBlock!.id!).pipe(
      finalize(() => {
        this.showLoadingDelete = false; // Устанавливаем состояние загрузки в false
        this.disableSubmit = false; // Включаем кнопку отправки
      })
    ).subscribe(
      (response: any) => {
        this.LoadBlocks();
        this.ShowSuccessToast("Блок \"" + this.inputValues['blockTitle'] + "\" удален.");
        this.selectedBlock = null;
        this.selectedChapter = null;
        this.inputValues['blockTitle'] = '';
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при удалении блока. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  AddBlock() {
    const NewBlock = { title: this.inputValues['blockTitle'] }
    this.apiBlocksService.AddBlock(NewBlock, this.selectedChapter!.id!).pipe(
      finalize(() => {
        this.showLoading = false;
        this.disableSubmit = false;
      })
    ).subscribe(
      (response: any) => {
        this.ShowSuccessToast(response.message);
        this.inputValues['blockTitle'] = '';
        this.LoadBlocks();
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при добавлении блока. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  UpdateBlock() {
    const NewBlock = { id: this.selectedBlock!.id, title: this.inputValues['blockTitle'] }

    this.apiBlocksService.UpdateBlock(NewBlock, this.selectedChapter!.id!).pipe(
      finalize(() => {
        this.showLoading = false;
        this.disableSubmit = false;
      })
    ).subscribe(
      (response: any) => {
        this.ShowSuccessToast("Блок обновлен на \"" + this.inputValues['blockTitle'] + "\".");
        this.LoadBlocks();
        this.selectedBlock = null;
        this.inputValues['blockTitle'] = '';
        console.log(response);
      },
      error => {
        this.ShowFailToast("Ошибка при обновлении блока. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  Submit() {
    if (!this.VerifyForm()) return;
    this.showLoading = true;
    this.disableSubmit = true;

    if (this.mode) {
      this.AddBlock();
    } else {
      this.UpdateBlock();
    }

  }
}
