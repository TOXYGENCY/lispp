import { Routes } from '@angular/router';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ChaptersPageComponent } from './chapters-page/chapters-page.component';
import { ChapterEditorComponent } from './chapter-editor/chapter-editor.component';
import { EditorPageComponent } from './editor-page/editor-page.component';
import { BlockEditorComponent } from './block-editor/block-editor.component';

export const routes: Routes = [
    { path: '', component: RegistrationPageComponent },
    { path: 'home', component: RegistrationPageComponent },
    { path: 'login', component: RegistrationPageComponent },
    { path: 'register', component: RegistrationPageComponent },
    {
        path: 'editor',
        component: EditorPageComponent,
        children: [
            { path: 'chapter', component: ChapterEditorComponent },
            { path: 'block', component: BlockEditorComponent },
            { path: 'paragraph', component: ChapterEditorComponent },
            { path: 'test', component: ChapterEditorComponent, },
        ]
    },
    { path: 'chapters', component: ChaptersPageComponent }, // Страница глав
    { path: '**', redirectTo: 'no' } // Перенаправление на логин для несуществующих маршрутов
];
