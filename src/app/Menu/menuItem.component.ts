import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
    selector: '[menu-item]',
    template: `
        <a *ngIf="!item.children && item.path !== undefined" routerLink="{{item.path}}"
           routerLinkActive="active">{{item.name}}</a>
        <a *ngIf="!item.children && item.click !== undefined" (click)="item.click()"
           routerLinkActive="active">{{item.name}}</a>
        <a *ngIf="item.children" class="dropdown-toggle">{{item.name}}</a>
        <ul class="d-menu" data-role="dropdown" *ngIf="item.children">
            <li *ngFor="let child of item.children" menu-item [item]="child"></li>
        </ul>
    `
})

export class MenuItemComponent implements OnInit {
    @Input()
    item: any;

    constructor(private elRef: ElementRef) {
    }

    ngOnInit() {
        if (this.item.name === '-') {
            this.elRef.nativeElement.classList.add('divider');
            // check if top level:
            // this.elRef.nativeElement.classList.add('app-bar-divider');
        }
    }

}
