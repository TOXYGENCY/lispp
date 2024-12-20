import { Routes } from '@angular/router';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ChaptersPageComponent } from './chapters-page/chapters-page.component';
import { ChapterEditorComponent } from './chapter-editor/chapter-editor.component';
import { EditorPageComponent } from './editor-page/editor-page.component';

export const routes: Routes = [
    { path: '', component: RegistrationPageComponent },
    { path: 'login', component: RegistrationPageComponent },
    { path: 'register', component: RegistrationPageComponent },
    { path: 'home', component: RegistrationPageComponent },
    {
        path: 'editor',
        component: EditorPageComponent,
        children: [
            {
                path: 'chapter', component: ChapterEditorComponent,
                children: [
                    { path: 'add', component: ChapterEditorComponent },
                    { path: 'edit/:id', component: ChapterEditorComponent },
                ]
            },
            {
                path: 'block', component: RegistrationPageComponent,
                children: [
                    { path: 'add', component: ChapterEditorComponent },
                    { path: 'edit/:id', component: ChapterEditorComponent },
                ]
            },
            {
                path: 'paragraph', component: ChapterEditorComponent,
                children: [
                    { path: 'add', component: ChapterEditorComponent },
                    { path: 'edit/:id', component: ChapterEditorComponent },
                ]
            },
            {
                path: 'test', component: ChapterEditorComponent,
                children: [
                    { path: 'add', component: ChapterEditorComponent },
                    { path: 'edit/:id', component: ChapterEditorComponent },
                ]
            },
        ]
    },
    { path: 'chapters', component: ChaptersPageComponent }, // Страница глав
    { path: '**', redirectTo: 'no' } // Перенаправление на логин для несуществующих маршрутов
];
