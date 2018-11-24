const btn = document.querySelector('.reset');
const canvas = document.querySelector('canvas');

btn.addEventListener('click', () => {
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
