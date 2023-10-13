import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterRecipesPipe } from './filter-recipes.pipe';

@NgModule({
  declarations: [FilterRecipesPipe],
  imports: [
    NgxSpinnerModule.forRoot({ type: 'pacman' }),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  providers: [],
  exports: [
    NgxSpinnerModule,
    BsDropdownModule,
    TabsModule,
    ProgressbarModule,
    FilterRecipesPipe,
  ],
})
export class SharedModule {}
