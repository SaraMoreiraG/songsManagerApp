import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-spinner',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
	isLoading = false;

	constructor(private loadingService: LoadingService) {
		this.loadingService.loading$.subscribe(
			(loading: boolean) => (this.isLoading = loading)
		);
	}
}
