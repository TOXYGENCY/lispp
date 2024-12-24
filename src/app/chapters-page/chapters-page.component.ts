import { Component, OnInit } from '@angular/core';
import { Question } from '../domain-models/Question';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
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
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../header/header.component';
import { ApiChaptersService } from '../api-services/chapters/api-chapters.service';
import { ApiParagraphsService } from '../api-services/paragraphs/api-paragraphs.service';
import { Chapter } from '../domain-models/Chapter';
import { Paragraph } from '../domain-models/Paragraph';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-chapters-page',
  standalone: true,
  imports: [
    HeaderComponent, AccordionModule, CardModule,
    PanelModule, CommonModule, ToastModule,
    InputGroupModule, InputGroupAddonModule, RadioButtonModule,
    InputTextareaModule, FormsModule, InputTextModule,
    ToggleButtonModule,

  ],
  providers: [MessageService],
  templateUrl: './chapters-page.component.html',
  styleUrl: './chapters-page.component.scss'
})
export class ChaptersPageComponent implements OnInit {

  constructor(private apiChaptersService: ApiChaptersService,
    private messageService: MessageService,
    private apiBlocksService: ApiBlocksService,
    private apiQuestionsService: ApiQuestionsService,
    private apiParagraphsService: ApiParagraphsService,
    private apiTestsService: ApiTestsService
  ) { }


  chapters: Chapter[] = [];
  chapter: Chapter | undefined;

  blocks: Block[] = [];
  block: Block | undefined;

  paragraphs: Paragraph[] = [];
  paragraph: Paragraph | undefined;

  tests: Test[] = [];
  test: Test | undefined;

  submitLabel: string = 'Завершить тест';

  selectedAnswers: { [questionId: string]: any } = {}; // Для хранения выбранных ответов
  lockedTests: { [testId: string]: boolean } = {}; // Для хранения отправленных тестов


  ngOnInit(): void {
    this.LoadContent();
    const storedLockedTests = sessionStorage.getItem('lockedTests');
    if (storedLockedTests) {
      // Восстанавливаем все пройденные тесты из sessionStorage
      this.lockedTests = JSON.parse(storedLockedTests);
    }
  }

  LoadContent() {
    console.log("Loading content...");

    // Загружаем главы
    this.apiChaptersService.GetAllChapters().subscribe(
      (chapters: Chapter[]) => {
        this.chapters = chapters;
        chapters.forEach(chapter => {
          // Загружаем блоки для каждой главы
          this.apiChaptersService.GetBlocksByChapterId(chapter.id!).subscribe(
            (blocks: Block[]) => {
              // Перед тем, как установить блоки в главу, наполним блоки параграфами и тестами
              blocks.forEach(block => {
                // Загружаем параграфы для каждого блока
                this.apiBlocksService.GetParagraphsByBlockId(block.id!).subscribe(
                  (paragraphs: Paragraph[]) => {
                    block.paragraphs = paragraphs;
                  },
                  (error: any) => {
                    this.ShowFailToast("Ошибка при загрузке параграфов. Попробуйте позже.");
                    console.error(error);
                  }
                );
                // Загружаем тесты для каждого блока
                this.apiBlocksService.GetTestsByBlockId(block.id!).subscribe(
                  (tests: Test[]) => {
                    block.tests = tests;
                    block.tests.forEach(test => {
                      this.apiTestsService.GetQuestionsByTestId(test.id!).subscribe(
                        (questions: any[]) => {
                          test.questions = questions;
                          test.questions.forEach(question => {
                            this.apiQuestionsService.GetAnswersByQuestionId(question.id!).subscribe(
                              (answers: any[]) => {
                                question.answers = answers;
                              },
                              (error: any) => {
                                this.ShowFailToast("Ошибка при загрузке ответов. Попробуйте позже.");
                                console.error(error);
                              }
                            );
                          });
                        },
                        (error: any) => {
                          this.ShowFailToast("Ошибка при загрузке вопросов. Попробуйте позже.");
                          console.error(error);
                        }
                      );
                    })
                  },
                  (error: any) => {
                    this.ShowFailToast("Ошибка при загрузке тестов. Попробуйте позже.");
                    console.error(error);
                  }
                );
              })
              chapter.blocks = blocks;
            },
            (error: any) => {
              this.ShowFailToast("Ошибка при загрузке блоков. Попробуйте позже.");
              console.error(error);
            }
          )
          console.warn(this.chapters);
        }
        ),

          (error: any) => {
            this.ShowFailToast("Ошибка при загрузке глав. Попробуйте позже.");
            console.error(error);
          }
      }
    );
  }

  ShowSuccessToast(message: string = 'Выполнено успешно.') {
    this.messageService.add({ severity: 'success', summary: 'Успех', detail: message });
  }

  ShowFailToast(message: string = 'Неизвестная ошибка.') {
    this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: message });
  }

  CheckAndHighlightAnswers(results: any, testId: string) {
    console.log("Checking and highlighting answers with: ", results);

    // Обрабатываем результаты с сервера и подсвечиваем правильные/неправильные ответы
    results.forEach(
      (result: any) => {
        const questionElement = document.getElementById(`question_${result.questionId}`);
        console.log("questionElement: ", questionElement);

        if (questionElement) {
          const answerElements = questionElement.querySelectorAll('.answer');
          console.log("answerElements: ", answerElements);

          answerElements.forEach((answerElement: any) => {
            // Подсвечиваем ответ
            const answerId = answerElement.getAttribute('data-answer-id');
            if (answerId === result.correctAnswerId && answerId === result.userAnswerId) {
              answerElement.classList.add('correct');
            } else if (answerId === result.userAnswerId) {
              answerElement.classList.add('incorrect');
            }
          });
        }
      });
  }


  LockTest(testId: string) {
    this.lockedTests[testId] = true; // Отмечаем тест как заблокированный
    // Сохраняем текущее состояние lockedTests в sessionStorage
    sessionStorage.setItem('lockedTests', JSON.stringify(this.lockedTests));

    const testElement = document.getElementById(`test_${testId}`);
    if (testElement) {
      testElement.classList.add('locked');
    }
    console.log(`Test ${testId} is now locked.`);
  }

  Submit(test_id: string) {
    console.log("Submitting answers to " + test_id);

    // Собираем ответы для отправки
    const userAnswers = Object.keys(this.selectedAnswers).map(questionId => {
      return {
        questionId: questionId,
        answerId: this.selectedAnswers[questionId]?.id, // id выбранного ответа
      };
    });

    // Отправляем запрос на сервер для проверки ответов
    this.apiTestsService.SubmitTestAnswers(test_id, userAnswers).subscribe(
      (response: any) => {
        // Ответ от сервера с результатами проверки
        console.log(test_id);

        this.CheckAndHighlightAnswers(response, test_id);
        this.LockTest(test_id);
      },
      (error: any) => {
        this.ShowFailToast("Ошибка при отправке ответов. Попробуйте позже.");
        console.error("Error while submitting test:", error);
      }
    );
  }
}


