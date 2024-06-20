import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';

const MatComponents = [
  MatButtonModule, MatIconModule
];

@NgModule({
  imports: [MatComponents],
  exports: [MatComponents]
})
export class MaterialModule { }
