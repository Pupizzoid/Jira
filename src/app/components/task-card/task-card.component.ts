import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() item;
  public deadline;

  ngOnInit(): void {
    this.deadline = new Date(this.item.deadline).toJSON().slice(0, 10).replace(/-/g, '-');
  }
  public getIconName = (): string => {
    return this.item.type === 'Bug' ? 'bug_report' : this.item.type === 'Task' ? 'fact_check' : 'insights';
  }

}
