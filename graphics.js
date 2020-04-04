class Graphics {

    _fill = true;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    fill() {
        this._fill = true;
    }

    stroke(width) {
        this._fill = false;
        if (width != undefined) this.context.lineWidth = width;
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

    clear() {
        this.color("white");
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    color(value) {
        this.context.fillStyle = value;
        this.context.strokeStyle = value;
    }

}
