import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; 
import { DocumentosComponent } from './pages/documentos/documentos.component'; 
import { MatriculasComponent } from './pages/matriculas/matriculas.component';
import { MatriculasEditarComponent } from './pages/matriculas-editar/matriculas-editar.component'; 
import { DocumentosEditComponent } from './pages/documentos-edit/documentos-edit.component';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';
import { AuthGuard } from './services/guard/auth.guard';
import { AuthCallbackComponent } from './componentes/auth-callback/auth-callback.component';
import { PreMatriculaComponent } from './pages/pre-matricula/pre-matricula.component';
import { PreMatriculaEditarComponent } from './pages/pre-matricula-editar/pre-matricula-editar.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent,  canActivate: [AuthGuard] },
  { path: 'documentos', component: DocumentosComponent ,  canActivate: [AuthGuard]},
  { path: 'documentos/:id', component: DocumentosEditComponent,  canActivate: [AuthGuard]},
  { path: 'matriculas', component: MatriculasComponent ,  canActivate: [AuthGuard]},
  { path: 'pre-matriculas', component: PreMatriculaComponent ,  canActivate: [AuthGuard]},
  { path: 'pre-matriculas/:cpf', component: PreMatriculaEditarComponent,  canActivate: [AuthGuard]},
  { path: 'pre-matriculas/novo', component: PreMatriculaEditarComponent,  canActivate: [AuthGuard]},
  { path: 'matriculas/:cpf', component: MatriculasEditarComponent ,  canActivate: [AuthGuard]},
  { path: 'auth-callback', component: AuthCallbackComponent } // Callback
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
