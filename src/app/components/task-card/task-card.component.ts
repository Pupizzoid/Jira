import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() item;

  public getIconName = (): string => {
    return this.item.type === 'Bug' ? 'bug_report' : this.item.type === 'Task' ? 'fact_check' : 'insights';
  }

}
