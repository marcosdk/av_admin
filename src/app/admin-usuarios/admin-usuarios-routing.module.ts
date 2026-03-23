import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsuariosListaComponent } from './admin-usuarios-lista/admin-usuarios-lista.component';
import { AdminUsuariosEditarComponent } from './admin-usuarios-editar/admin-usuarios-editar.component';

const routes: Routes = [
  { path: '', component: AdminUsuariosListaComponent },
  { path: ':username', component: AdminUsuariosEditarComponent },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUsuariosRoutingModule { }
