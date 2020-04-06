export class Wall {

  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  contains(x: number, y: number) {
    return this.x <= x && x <= this.x + this.width &&
      this.y <= y && y <= this.y + this.height;
  }

}
