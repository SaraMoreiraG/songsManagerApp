import { NgModule } from '@angular/core';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({ Pencil, Trash2 })
  ],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
