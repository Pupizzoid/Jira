import {animate, query, style, transition, trigger, animateChild, group} from '@angular/animations';

export const slideInAnimation =
  trigger('slideInAnimation', [
    transition('* <=> *', [
      query(':self',
      [
        style({ opacity: 0 })
      ],
      { optional: true }
    ),

    query(':self',
      [
        style({ opacity: 0 }),
        animate('.3s', style({ opacity: 1 }))
      ],
      { optional: true }
    )
    ]),
  ]);
