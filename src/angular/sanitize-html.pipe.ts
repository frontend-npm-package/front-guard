import { Pipe, PipeTransform } from '@angular/core';
import { FrontGuardService } from './front-guard.service';

@Pipe({
    name: 'sanitizeHtml',
    pure: true,
})
export class SanitizeHtmlPipe implements PipeTransform {
    constructor(private fg: FrontGuardService) { }

    transform(value: string): string {
        return this.fg.sanitizeHtml(value);
    }
}
