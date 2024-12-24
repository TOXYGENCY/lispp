import { Component, OnInit } from '@angular/core';
import { Question } from '../domain-models/Question';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { ToastModule } from 'primeng/toast';
import { Test } from '../domain-models/Test';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ApiBlocksService } from '../api-services/blocks/api-blocks.service';
import { ApiQuestionsService } from '../api-services/tests/questions/api-questions.service';
import { ApiAnswersService } from '../api-services/tests/answers/api-answers.service';
import { ApiTestsService } from '../api-services/tests/api-tests.service';
import { Block } from '../domain-models/Block';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-tests-editor',
  standalone: true,
  imports: [
    StyleClassModule, InputTextModule, FormsModule,
    CommonModule, SelectButtonModule,
    DropdownModule, ToastModule, ButtonModule,
    InputGroupModule, InputGroupAddonModule, RadioButtonModule,
    InputTextareaModule,
  ],
  providers: [MessageService],
  templateUrl: './tests-editor.component.html',
  styleUrl: './tests-editor.component.scss'
})

export class TestsEditorComponent implements OnInit {

  constructor(private apiBlocksService: ApiBlocksService,
    private apiQuestionsService: ApiQuestionsService,
    private apiAnswersService: ApiAnswersService,
    private apiTestsService: ApiTestsService,
    private messageService: MessageService) {

  }

  inputFields: any[] = [];
  inputValues: any = {
    testTitle: '',
    questionText: '',
  };

  selectedBlock: Block | null = null;
  blocks: Block[] = [];
  block: Block | undefined;

  selectedTest: Test | null = null;
  tests: Test[] = [];
  test: Test | undefined;

  questions: Question[] = [];  // Массив для хранения вопросов
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
      }
    ];
  }

  TrackByIndex(index: number, item: any): any {
    return item.id;  // Уникальный ID для отслеживания изменений
  }

  ShowSuccessToast(message: string = 'Выполнено успешно.') {
    this.messageService.add({ severity: 'success', summary: 'Успех', detail: message });
  }

  ShowFailToast(message: string = 'Неизвестная ошибка.') {
    this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: message });
  }

  // Добавление нового вопроса
  AddQuestion() {
    const newQuestion: Question = {
      id: this.GenerateUniqueId(),  // Генерация уникального ID для каждого вопроса
      text: '',
      answers: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    };
    this.questions.push(newQuestion);
  }

  // Генерация уникального идентификатора для каждого вопроса
  GenerateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Удаление вопроса
  DeleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  // Обработка изменения правильного ответа
  MarkCorrectAnswer(questionIndex: number, correctAnswerIndex: number) {
    this.questions[questionIndex].answers.forEach((answer, index) => {
      answer.isCorrect = index === correctAnswerIndex;  // Устанавливаем правильность для каждого ответа
    });
  }

  DeleteTest() {
    this.showLoadingDelete = true;
    this.disableSubmit = true;
    this.apiTestsService.DeleteTestById(this.selectedTest!.id!).subscribe(
      (response) => {
        this.ShowSuccessToast('Тест успешно удален.');
        this.LoadTests();
        this.ClearTest();
      },
      error => {
        this.ShowFailToast('Ошибка при удалении теста. Попробуйте позже.');
        console.error(error);
      },  
      () => {
        this.showLoadingDelete = false;
        this.disableSubmit = false;
      });
  }

  LoadTests() {
    console.log("Loading tests...");
    this.apiTestsService.GetAllTests().subscribe(
      (response: Test[]) => {
        console.log(response);
        this.tests = response;
      },
      error => {
        this.ShowFailToast("Ошибка при загрузке тестов. Попробуйте позже.");
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


  SetTest() {
    // Ставим связанный блок в поле
    if (this.selectedTest) {
      this.apiTestsService.GetBlockByTestId(this.selectedTest.id!).subscribe(
        (response: Block) => {
          console.log("Linked block:", response);
          this.LoadBlocks();
          this.selectedBlock = response;
        },
        (error: any) => {
          this.ShowFailToast("Ошибка при загрузке блока. Попробуйте позже.");
          console.error(error);
        }
      );

      // Ставим название теста в поле
      this.inputValues['testTitle'] = this.selectedTest.title; // Обновляем значение поля ввода при выборе теста

      // Загружаем вопросы и ответы к ним
      this.apiTestsService.GetQuestionsByTestId(this.selectedTest.id!).subscribe(
        (questions: any) => {
          this.questions = questions;

          // Загружаем ответы для каждого вопроса
          this.questions.forEach((question) => {
            this.apiQuestionsService.GetAnswersByQuestionId(question.id!).subscribe(
              (answers: any) => {
                question.answers = answers;

                // Получаем и обновляем правильные ответы
                question.answers.forEach((answer) => {
                  this.apiAnswersService.GetIsCorrectByAnswerId(answer.id!).subscribe(
                    (response: any) => {
                      answer.isCorrect = response.is_correct;
                    },
                    (error: any) => {
                      this.ShowFailToast("Ошибка при загрузке правильности ответа. Попробуйте позже.");
                      console.error(error);
                    }
                  )
                });
              },
              (error: any) => {
                this.ShowFailToast("Ошибка при загрузке ответов вопроса. Попробуйте позже.");
                console.error(error);
              }
            );
          });
        },
        (error: any) => {
          this.ShowFailToast("Ошибка при загрузке вопросов теста. Попробуйте позже.");
          console.error(error);
        }
      );
    }
  }

  ClearTest() {
    this.selectedTest = null;
    this.selectedBlock = null;
    this.questions.forEach(question => {
      question.answers = [];
    });
    this.questions = [];
    this.inputValues['testTitle'] = '';
  }

  AddTest(testData: Test) {
    this.apiTestsService.AddTest(testData).subscribe(
      response => {
        console.log('Тест добавлен:', response);
        if (response) {
          this.ShowSuccessToast("Тест добавлен.");
        }
      },
      error => {
        this.ShowFailToast("Ошибка при добавлении теста. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  UpdateTest(test_id: string, testData: Test) {
    this.apiTestsService.UpdateTest(test_id, testData).subscribe(
      response => {
        if (response) {
          console.log('Тест обновлен:', response);
          this.ShowSuccessToast("Тест обновлен.");
        }
      },
      error => {
        this.ShowFailToast("Ошибка при обновлении теста. Попробуйте позже.");
        console.error(error);
      }
    );
  }

  // Отправка данных
  Submit() {
    if (!this.VerifyForm()) return;

    const testData = {
      title: this.inputValues['testTitle'],  // Название теста
      blockId: this.selectedBlock!.id,
      questions: this.questions.map(question => ({
        text: question.text,  // Текст вопроса
        answers: question.answers.map(answer => ({
          text: answer.text,  // Текст ответа
          isCorrect: answer.isCorrect  // Правильность ответа
        }))
      }))
    };

    // Отправка данных на сервер
    console.warn("Test data: ", testData);
    if (this.mode) {
      this.AddTest(testData);
    } else {
      console.warn("Test ID: ", this.selectedTest!.id);
      this.UpdateTest(this.selectedTest!.id!, testData);
      this.LoadTests();
    }
    this.ClearTest();
  }


  VerifyForm(): boolean {
    // Проверка Названия теста
    console.warn("Test title: ", this.inputValues['testTitle']);
    if (!this.inputValues['testTitle']) {
      this.ShowFailToast("Введите название теста.");
      return false;
    }

    if (!this.mode) {
      if (!this.selectedTest) {
        this.ShowFailToast("Выберите тест для редактирования.");
        return false;
      }
    }
    if (!this.selectedBlock) {
      this.ShowFailToast("Прикрепите тест к блоку.");
      return false;
    }

    // Проверка текстов всех вопросов
    for (let i = 0; i < this.questions.length; i++) {
      console.log("Question index: ", i);

      const question = this.questions[i];
      console.warn("Question text: ", question.text);
      if (!question.text) {
        this.ShowFailToast(`Введите текст для вопроса ${i + 1}.`);
        return false;
      }

      // Проверка вариантов ответов
      for (let j = 0; j < question.answers.length; j++) {
        const answer = question.answers[j];
        console.warn("Answer text: ", answer.text);
        if (!answer.text) {
          this.ShowFailToast(`Введите вариант ответа ${j + 1} для вопроса ${i + 1}.`);
          return false;
        }
      }

      // Проверка правильного ответа
      const correctAnswerCount = question.answers.filter(a => a.isCorrect).length;
      console.warn("Correct answer count: ", correctAnswerCount);

      if (correctAnswerCount !== 1) {
        this.ShowFailToast(`Для вопроса ${i + 1} должен быть выбран ровно один правильный ответ.`);
        return false;
      }
    }
    if (this.questions.length === 0) {
      this.ShowFailToast("Добавьте хотя бы один вопрос.");
      return false;
    }

    // Если все проверки пройдены
    return true;
  }
}




