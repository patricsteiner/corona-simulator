import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.less']
})
export class ParametersComponent implements OnInit {

  parameterForm = this.fb.group({
    initialHealthyPopulation: [100],
    initialInfectedPopulation: [3],
    infectionRadius: [10],
    infectionProbability: [.8],
    isolationRatio: [.4],
    daysUntilRecoveredOrDead: [20],
    reinfectionProbability: [.1],
  });

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
  }

}
