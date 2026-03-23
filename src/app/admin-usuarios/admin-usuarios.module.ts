import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminUsuariosRoutingModule } from './admin-usuarios-routing.module';
import { AdminUsuariosListaComponent } from './admin-usuarios-lista/admin-usuarios-lista.component';
import { AdminUsuariosEditarComponent } from './admin-usuarios-editar/admin-usuarios-editar.component';


@NgModule({
  declarations: [
    AdminUsuariosListaComponent,
    AdminUsuariosEditarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminUsuariosRoutingModule
  ]
})
export class AdminUsuariosModule { }
