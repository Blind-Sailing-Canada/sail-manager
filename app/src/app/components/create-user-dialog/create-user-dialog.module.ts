import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateUserDialogComponent } from './create-user-dialog.component';

@NgModule({
    declarations: [
        CreateUserDialogComponent,
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        ListFilterModule,
        ReactiveFormsModule,
    ]
})
export class CreateUserDialogModule { }
