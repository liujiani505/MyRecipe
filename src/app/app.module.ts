import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { StoreModule } from '@ngrx/store';
import { LoggingService } from './logging.service';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  // these are all egarly loaded modules because we imported them into app module
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    StoreModule.forRoot({shoppingList: shoppingListReducer})
  ],
  providers: [LoggingService],
  bootstrap: [AppComponent]
})


export class AppModule { }
