export class Graphics {

  private _fill = true;
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
  }

  fill() {
    this._fill = true;
  }

  stroke(width: number) {
    this._fill = false;
    if (width !== undefined) this.context.lineWidth = width;
  }

  circle(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI, false);
    if (this._fill) {
      this.context.fill();
    } else {
      this.context.stroke();
    }
  }

  rect(x, y, w, h) {
    if (this._fill) {
      this.context.fillRect(x, y, w, h);
    } else {
      this.context.strokeRect(x, y, w, h);
    }
  }

  text(text: string, x, y, size) {
    this.context.font = size + 'px Arial';
    this.context.fillText(text, x, y);
  }

  color(value) {
    this.context.fillStyle = value;
    this.context.strokeStyle = value;
  }

}

