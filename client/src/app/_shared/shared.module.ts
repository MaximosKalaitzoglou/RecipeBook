import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  imports: [
    NgxSpinnerModule.forRoot({ type: 'pacman' }),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ],
  providers: [
  ],
  exports: [NgxSpinnerModule, BsDropdownModule, TabsModule],
})
export class SharedModule {}
