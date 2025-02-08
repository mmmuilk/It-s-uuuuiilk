document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery');
  const gradientOverlay = document.querySelector('.gradient-overlay');
  const images = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png'
  ];
  
  // Add the canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'world';
  document.body.appendChild(canvas);

  // 动态
  images.forEach(src => {
    const artItem = document.createElement('div');
    artItem.classList.add('art-item');
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Art ${src.split('.')[0]}`;
    
    artItem.appendChild(img);
    gallery.appendChild(artItem);
  });

  const artItems = document.querySelectorAll('.art-item');

  // 滚动（失败版
  gallery.addEventListener('wheel', (e) => {
    e.preventDefault();
    gallery.scrollLeft += e.deltaY;
  });

  // 悬停
  artItems.forEach((item, index) => {
    item.addEventListener('mouseover', () => {
      artItems.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index) {
          const direction = otherIndex > index ? 20 : -20;
          otherItem.style.transform = `translateX(${direction}px)`;
        }
      });
    });

    item.addEventListener('mouseout', () => {
      artItems.forEach((otherItem) => {
        otherItem.style.transform = 'translateX(0)';
      });
    });
  });

  // 控制渐变层的显示和隐藏（失败版
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const galleryWrapperTop = document.querySelector('.gallery-wrapper').offsetTop;

    if (scrollY >= galleryWrapperTop) {
      gradientOverlay.style.opacity = 1;
    } else {
      gradientOverlay.style.opacity = 0;
    }
  });

  // 双击出现猫猫效果
  document.addEventListener('dblclick', (e) => {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.top = `${e.clientY}px`;
    heart.style.left = `${e.clientX}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);
  });

  // 物理引擎部分
  const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

  // 创建引擎
  const engine = Engine.create();
  const world = engine.world;

  // 创建渲染器
  const render = Render.create({
    element: document.body,
    canvas: document.getElementById('world'),
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: 'transparent'
    }
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  // 添加边界
  const boundaries = [
    Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, { isStatic: true }),
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true }),
    Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true }),
    Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true })
  ];
  World.add(world, boundaries);

  // 添加可拖拽的猫猫
  const maomao = Bodies.rectangle(200, 200, 50, 50, {
    render: {
      sprite: {
        texture: 'maomao.png',
        xScale: 0.1,
        yScale: 0.1
      }
    }
  });
  World.add(world, maomao);

  // 添加鼠标控制
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });
  World.add(world, mouseConstraint);

  // 确保渲染器在窗口大小改变时调整
  window.addEventListener('resize', function() {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: window.innerWidth, y: window.innerHeight }
    });
  });
});
