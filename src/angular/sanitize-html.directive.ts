import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FrontGuardService } from './front-guard.service';

@Directive({
    selector: '[sanitizeHtml]',
})
export class SanitizeHtmlDirective implements OnChanges {
    @Input('sanitizeHtml') html!: string;

    constructor(private el: ElementRef, private fg: FrontGuardService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if ('html' in changes) {
            const safe = this.fg.sanitizeHtml(this.html || '');
            this.el.nativeElement.innerHTML = safe;
        }
    }
}
