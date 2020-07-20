/**
@license
Copyright 2020 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {BaseElement} from '@material/mwc-base/base-element.js';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';
import {styleMap} from 'lit-html/directives/style-map.js';

/** @soyCompatible */
export class CircularProgressBase extends BaseElement {
  @query('.mdc-circular-progress') protected mdcRoot!: HTMLElement;

  protected mdcFoundation = undefined;

  protected readonly mdcFoundationClass = undefined;

  @property({type: Boolean, reflect: true}) indeterminate = false;

  @property({type: Number, reflect: true}) progress = 0;

  @property({type: Number, reflect: true}) density = 0;

  @property({type: Boolean, reflect: true}) closed = false;

  @property() ariaLabel = '';

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }

  /**
   * @soyCompatible
   */
  protected render() {
    /** @classMap */
    const classes = {
      'mdc-circular-progress--closed': this.closed,
      'mdc-circular-progress--indeterminate': this.indeterminate,
    };

    const containerSideLength = this.getContainerSideLength();
    const styles = {
      'width': `${containerSideLength}px`,
      'height': `${containerSideLength}px`,
    };

    return html`
      <div
        class="mdc-circular-progress ${classMap(classes)}"
        style="${styleMap(styles)}"
        role="progressbar"
        aria-label="${this.ariaLabel}"
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow="${
        ifDefined(this.indeterminate ? undefined : `${this.progress}`)}">
        ${this.renderDeterminateContainer()}
        ${this.renderIndeterminateContainer()}
      </div>`;
  }

  private renderDeterminateContainer() {
    const containerSideLength = this.getContainerSideLength();
    const center = containerSideLength / 2;

    return html`
      <div class="mdc-circular-progress__determinate-container">
        <svg class="mdc-circular-progress__determinate-circle-graphic"
             viewBox="0 0 ${containerSideLength} ${containerSideLength}">
          <circle class="mdc-circular-progress__determinate-circle"
                  cx="${center}" cy="${center}" r="${this.getCircleRadius()}"
                  stroke-dasharray="${2 * Math.PI * this.getCircleRadius()}"
                  stroke-dashoffset="${this.getDeterminateStrokeDashOffset()}"
                  stroke-width="${this.getStrokeWidth()}"/>
        </svg>
      </div>`;
  }

  protected renderIndeterminateContainer() {
    return html`
      <div class="mdc-circular-progress__indeterminate-container">
        ${this.renderIndeterminateSpinnerLayer()}
      </div>`;
  }

  protected renderIndeterminateSpinnerLayer(classes: string[] = []) {
    const containerSideLength = this.getContainerSideLength();
    const center = containerSideLength / 2;
    const strokeWidth = this.getStrokeWidth();
    const circleRadius = this.getCircleRadius();
    const circumference = 2 * Math.PI * circleRadius;

    return html`
      <div class="mdc-circular-progress__spinner-layer ${classes.join(' ')}">
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${containerSideLength} ${containerSideLength}">
            <circle cx="${center}" cy="${center}" r="${circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${.5 * circumference}"
                    stroke-width="${strokeWidth}"/>
          </svg>
        </div><div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${containerSideLength} ${containerSideLength}">
            <circle cx="${center}" cy="${center}" r="${circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${.5 * circumference}"
                    stroke-width="${strokeWidth * .8}"/>
          </svg>
        </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${containerSideLength} ${containerSideLength}">
            <circle cx="${center}" cy="${center}" r="${circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${.5 * circumference}"
                    stroke-width="${strokeWidth}"/>
          </svg>
        </div>
      </div>`;
  }

  update(changedProperties: Map<string, string>) {
    super.update(changedProperties);

    // Bound progress value in interval [0, 1].
    if (changedProperties.has('progress')) {
      if (this.progress > 1) {
        this.progress = 1;
      }

      if (this.progress < 0) {
        this.progress = 0
      }
    }
  }

  private getContainerSideLength() {
    return 48 + this.density * (4);
  }

  private getDeterminateStrokeDashOffset(): number {
    const circleRadius = this.getCircleRadius();
    const circumference = 2 * Math.PI * circleRadius;

    return (1 - this.progress) * circumference;
  }

  private getCircleRadius() {
    return this.density >= -3 ? 18 + this.density * 11 / 6 :
                                12.5 + (this.density + 3) * 5 / 4;
  }

  private getStrokeWidth() {
    return this.density >= -3 ? 4 + this.density * (1 / 3) :
                                3 + (this.density + 3) * (1 / 6);
  }

  protected createAdapter() {
    return {};
  }
}
