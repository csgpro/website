// angular
import {Component, Input} from '@angular/core';

@Component({
    selector: 'error-summary',
    templateUrl: 'error-summary.html'
})
export default class ErrorSummary {
    @Input() errors;
}