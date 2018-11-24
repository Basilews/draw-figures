class DrawFigures {
  constructor() {
    this.points = [];
    this.it = 0;
    this.x0 = null;
    this.y0 = null;
    this.canvas = document.querySelector('canvas');
    this.btn = document.querySelector('.reset');
    this.info = document.querySelector('.info');
    this.ctx = this.canvas.getContext('2d');
    this.disclaimer = document.querySelector('.disclaimer');

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.disclaimer.addEventListener('click', event => this.initDrawing(event));
    this.canvas.addEventListener('click', event => this.initDrawing(event));
    this.btn.addEventListener('click', () => this.resetCanvas());
  }

  initDrawing(event) {
    this.disclaimer.remove();
    this.generatePoints(event.clientX, event.clientY);
  }

  generatePoints(x, y) {
    if (this.it < 3) {
      this.points.push({ x, y });
      this.drawPoint(x, y);
      this.info.innerHTML += `<p>point${this.it + 1}: x: ${x}; y: ${y}</p>`;

      if (this.it === 2) {
        this.drawCircle(this.drawParallelogram());
      }

      this.it++;
    }
  }

  drawPoint(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5.5, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.strokeStyle = 'red';
    this.ctx.stroke();
  }

  resetCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.it = 0;
    this.points = [];
    this.info.innerHTML = '';
    this.x0 = this.y0 = null;
  }

  drawParallelogram() {
    const { points } = this;
    points.push(this.calculateFourthVertex());

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < 4; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.lineTo(points[0].x, points[0].y);
    this.ctx.strokeStyle = 'blue';
    this.ctx.stroke();

    const a = Math.round(
      Math.sqrt(
        Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2)
      )
    );

    const b = Math.round(
      Math.sqrt(
        Math.pow(points[2].x - points[1].x, 2) + Math.pow(points[2].y - points[1].y, 2)
      )
    );

    const area = a * b;

    this.info.innerHTML += `<p>area of parallelogram: ${Math.round(area)}</p>`;
    this.info.innerHTML += `<p>area of square: ${Math.round(area)}</p>`;

    return area;
  }

  calculateFourthVertex() {
    const { points } = this;

    this.x0 = Math.round((points[0].x + points[2].x) / 2);
    this.y0 = Math.round((points[0].y + points[2].y) / 2);

    const x = points[0].x + points[2].x - points[1].x;
    const y = points[0].y + points[2].y - points[1].y;
    return { x, y };
  }

  drawCircle(area) {
    const r = Math.round(Math.sqrt(area / Math.PI));

    this.ctx.beginPath();
    this.ctx.arc(this.x0, this.y0, r, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#ead147';
    this.ctx.stroke();
  }
};

new DrawFigures;
