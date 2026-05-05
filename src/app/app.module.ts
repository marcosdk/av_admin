import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopComponent } from './componentes/top/top.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentosComponent } from './pages/documentos/documentos.component';
import { DocumentosEditComponent } from './pages/documentos-edit/documentos-edit.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './http-token.interceptor';
import { AuthCallbackComponent } from './componentes/auth-callback/auth-callback.component';
import { PhoneFormatPipe } from './componentes/phone-format/phone-format.pipe';
import { CpfFormatPipe } from './componentes/cpf-format/cpf-format.pipe';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { MatriculasComponent } from './pages/matriculas/matriculas.component';
import { MatriculasEditarComponent } from './pages/matriculas-editar/matriculas-editar.component';
import { PrecadastroComponent } from './pages/precadastro/precadastro.component';
import { PreMatriculaComponent } from './pages/pre-matricula/pre-matricula.component';
import { PreMatriculaEditarComponent } from './pages/pre-matricula-editar/pre-matricula-editar.component';
import { UsuariosListaComponent } from './pages/usuarios-lista/usuarios-lista.component';
import { UsuariosEditarComponent } from './pages/usuarios-editar/usuarios-editar.component';
import { LoginComponent } from './pages/login/login.component';
import { EventosListaComponent } from './pages/eventos-lista/eventos-lista.component';
import { EventosEditarComponent } from './pages/eventos-editar/eventos-editar.component';
import { PaymentsListaComponent } from './pages/payments-lista/payments-lista.component';
import { PaymentsEditarComponent } from './pages/payments-editar/payments-editar.component';


  
@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    DocumentosComponent,
    DocumentosEditComponent,
    AuthCallbackComponent,
    CpfFormatPipe,
    PhoneFormatPipe,
    MatriculasComponent,
    MatriculasEditarComponent,
    PrecadastroComponent,
    PreMatriculaComponent,
    PreMatriculaEditarComponent, 
    UsuariosListaComponent,
    UsuariosEditarComponent,
    LoginComponent,
    EventosListaComponent,
    EventosEditarComponent,
    PaymentsListaComponent,
    PaymentsEditarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,    
    ImageCropperComponent, // <- adicionar aqui, pois é standalone
    NgxMaskDirective
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
