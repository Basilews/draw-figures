paper.install(window);

class DrawFigures {
  constructor() {
    this.points = [];
    this.it = 0;
    this.x0 = null;
    this.y0 = null;

    this.point1 = null;
    this.point2 = null;
    this.point3 = null;
    this.prlg = null;
    this.circle = null;
    this.centerPoint = null;

    this.canvas = document.querySelector('canvas');
    this.btn = document.querySelector('.reset');
    this.info = document.querySelector('.info');
    this.ctx = this.canvas.getContext('2d');
    this.disclaimer = document.querySelector('.disclaimer');
    this.title = document.querySelector('.title');
    this.description = document.querySelector('.description');
    this.help = document.querySelector('.help');
    this.close = document.querySelector('.close');

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.title.addEventListener('mousedown', event => this.initDrawing(event));
    this.canvas.addEventListener('mousedown', event => this.initDrawing(event));
    this.btn.addEventListener('mousedown', () => this.resetCanvas());
    this.help.addEventListener('mousedown', () => this.showDescription());
    this.close.addEventListener('mousedown', () => this.closeDescription());

    this.setupPaper();
  }

  setupPaper() {
    paper.setup('canvas');
  }

  showDescription() {
    this.disclaimer.classList.add('isHidden');
    this.description.classList.remove('isHidden');
  }

  closeDescription() {
    this.disclaimer.classList.remove('isHidden');
    this.description.classList.add('isHidden');
  }

  initDrawing(event) {
    this.disclaimer.remove();
    this.description.remove();
    this.btn.classList.remove('isHidden');
    this.generatePoints(event.clientX, event.clientY);
  }

  generatePoints(x, y) {
    if (this.it < 3) {
      this.points.push({ x, y });
      this.drawPoint(x, y);
      this.info.innerHTML += `
        <p class="point${this.it + 1}">
          point${this.it + 1}: x: ${x}; y: ${y}
        </p>
      `;

      if (this.it === 2) {
        this.drawCircle(this.drawParallelogram());
        this.drawCenterPoint(this.x0, this.y0);
      }

      this.it++;
    }
  }

  drawPoint(x, y) {
    const point = `point${this.it + 1}`;

    this[point] = new Path.Circle(new Point(x, y), 11);
    this[point].fillColor = 'red';

    this[point].on('mousedrag', event => {
      if (this.prlg) {
        // Redraw rigures
        this.redrawParallelogram(point, event);
        this.redrawCircle();
        this.redrawCenterPoint();

        // Update Figures Information
        this.updatePointInfo(point, event);
        this.updateAreaInfo();
      }
    });
  }

  updatePointInfo(point, event) {
    const pointLabel = document.querySelector(`.${point}`);
    pointLabel.innerHTML = `
      ${point}:
      x: ${Math.round(event.point.x)};
      y: ${Math.round(event.point.y)}
    `;
  }

  updateAreaInfo() {
    const areaLabel = document.querySelector('.area');
    areaLabel.innerHTML = `
      area: ${Math.round(Math.abs(this.prlg.area))}
    `;
  }

  drawCenterPoint(x, y) {
    this.centerPoint = new Path.Circle(new Point(x, y), 3);
    this.centerPoint.fillColor = 'black';
  }

  redrawCenterPoint() {
    this.centerPoint.position = new Point(this.x0, this.y0);
  }

  resetCanvas() {
    project.clear();
    this.it = 0;
    this.points = [];
    this.info.innerHTML = '';
    this.x0 = this.y0 = null;
  }

  drawParallelogram() {
    const { points } = this;
    points.push(this.calculateFourthVertex());

    this.prlg = new Path({
      segments: this.points.map(point => [point.x, point.y]),
      strokeColor: 'blue',
      closed: true,
    });

    const area = this.prlg.area;
    this.info.innerHTML += `
      <p class="area">
        area: ${Math.round(Math.abs(area))}
      </p>
    `;

    return area;
  }

  redrawParallelogram(point, event) {
    this[point].position = event.point;
    this.prlg.curves[event.target.index].point1 = event.point;
    this.points[event.target.index] = { x: event.point.x, y: event.point.y };
    this.prlg.curves[3].point1 = new Point(this.calculateFourthVertex());
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

    this.circle = new Path.Circle(new Point(this.x0, this.y0), r);
    this.circle.strokeColor = '#ead147';
  }

  redrawCircle() {
    const r = Math.round(Math.sqrt(Math.abs(this.prlg.area) / Math.PI));
    this.circle.remove();
    this.circle = new Path.Circle(new Point(this.x0, this.y0), r);
    this.circle.strokeColor = '#ead147';
  }
};

window.onload = function () {
  new DrawFigures;
}
