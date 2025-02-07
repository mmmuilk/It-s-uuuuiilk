// 动态加载画作图片
const gallery = document.querySelector('.gallery .scrollable');
const images = [
  '1.png', '2.png', '3.png',
  '4.png', '5.png', '6.png', '7.png'
];
images.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  gallery.appendChild(img);
});