import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[customDirective]'
})
export class CustomDirective {
  @Input() customDirective: string;

  constructor(private el: ElementRef) {
    this.customDirective='';
  }
//https://www.bairesdev.com/blog/angular-dependency-injection/
  ngOnInit() {
    this.el.nativeElement.style.color = this.customDirective;
  }
}