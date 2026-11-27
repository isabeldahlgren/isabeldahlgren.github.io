(() => {
  const sections = [...document.querySelectorAll('.print-series')];
  if (!sections.length || !CSS.supports('perspective', '900px')) return;
  const viewport = document.querySelector('.gallery-room');
  const world = document.querySelector('.room-world');
  const architecture = document.querySelector('.room-architecture');
  const nav = document.querySelector('.room-series');
  nav.hidden = sections.length < 2;
  const keys = new Set();
  const touchQuery = matchMedia('(pointer: coarse)');
  let touchMode = touchQuery.matches;
  const controls = document.querySelector('.room-controls');
  const hint = document.querySelector('.room-view-hint');
  const camera = { x: 0, z: 200, yaw: 0, pitch: 0 };
  let perspective = 900, previous = 0, selectedSeries = 0;
  function surface(kind, width, height, x, y, z, rotation) {
    const el = document.createElement('div');
    el.className = `room-surface room-${kind}`;
    Object.assign(el.style, { width: `${width}px`, height: `${height}px`, transform: `translate3d(${x}px,${y}px,${z}px) ${rotation} translate(-50%,-50%)` });
    architecture.append(el);
    return el;
  }
  let halfWidth = 1100, backZ = -2200;
  const buttons = sections.map((section, i) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = section.querySelector('h2').textContent;
    button.addEventListener('click', () => select(i)); nav.append(button);
    world.append(section);
    section.querySelectorAll('.print-open, .work-read').forEach(link => {
      link.addEventListener('focus', () => {
        if (!link.matches(':focus-visible')) return;
        const print = link.closest('.print');
        const x = +print.dataset.x, z = +print.dataset.z, angle = +print.dataset.angle;
        if (touchMode) {
          camera.yaw = Math.atan2(x - camera.x, camera.z - z);
          camera.pitch = 0; render(); return;
        }
        if (angle === 0) { camera.x = x; camera.z = backZ + 1250; camera.yaw = 0; }
        else if (angle === 180) { camera.x = x; camera.z = -50; camera.yaw = Math.PI; }
        else { camera.x = angle === 90 ? -halfWidth + 1250 : halfWidth - 1250; camera.z = z; camera.yaw = angle === 90 ? -Math.PI / 2 : Math.PI / 2; }
        camera.pitch = 0; render();
      });
    });
    return button;
  });
  function arrange(section) {
    const prints = [...section.querySelectorAll('.print')];
    const gap = 160;
    const walls = ['front', 'left', 'right', 'rear'];
    const automatic = prints.filter(print => !walls.includes(print.dataset.wall));
    const onWall = wall => prints.filter(print => print.dataset.wall === wall);
    const back = Math.ceil(automatic.length / 3);
    const left = Math.ceil((automatic.length - back) / 2);
    const groups = [
      [[...onWall('front'), ...automatic.slice(0, back)], 0],
      [[...onWall('left'), ...automatic.slice(back, back + left)], 90],
      [[...onWall('right'), ...automatic.slice(back + left)], -90],
      [onWall('rear'), 180]
    ];
    const totals = groups.map(([works]) => works.reduce((sum, print) => sum + print.offsetWidth, 0) + Math.max(0, works.length - 1) * gap);
    halfWidth = Math.max(1100, totals[0] / 2 + 250, totals[3] / 2 + 250);
    const depth = Math.max(3400, totals[1] + 700, totals[2] + 700);
    backZ = 1200 - depth;
    const centerZ = (backZ + 1200) / 2;
    const extent = Math.max(550, ...prints.map(print => print.offsetHeight / 2 + 150));
    const floorY = Math.max(420, extent - 130);
    const topY = -extent - 130;
    architecture.replaceChildren();
    surface('wall', halfWidth * 2, floorY - topY, 0, (floorY + topY) / 2, backZ, '');
    surface('wall', depth, floorY - topY, -halfWidth, (floorY + topY) / 2, centerZ, 'rotateY(90deg)');
    surface('wall', depth, floorY - topY, halfWidth, (floorY + topY) / 2, centerZ, 'rotateY(-90deg)');
    surface('wall', halfWidth * 2, floorY - topY, 0, (floorY + topY) / 2, 1200, 'rotateY(180deg)');
    surface('floor', halfWidth * 2, depth, 0, floorY, centerZ, 'rotateX(90deg)');
    groups.forEach(([works, angle], group) => {
      let offset = -totals[group] / 2;
      works.forEach(print => {
        const center = offset + print.offsetWidth / 2;
        const x = angle === 0 ? center : angle === 180 ? -center : angle === 90 ? -halfWidth + 4 : halfWidth - 4;
        const z = angle === 0 ? backZ + 4 : angle === 180 ? 1196 : centerZ + (angle === 90 ? -center : center);
        Object.assign(print.dataset, { x, z, angle });
        print.style.transform = `translate3d(${x}px,-45px,${z}px) rotateY(${angle}deg) translate(-50%,-50%)`;
        offset += print.offsetWidth + gap;
      });
    });
  }

  function reset() { Object.assign(camera, { x: 0, z: touchMode ? (backZ + 1200) / 2 : 200, yaw: 0, pitch: 0 }); keys.clear(); render(); }
  function select(i) {
    selectedSeries = i;
    sections.forEach((section, j) => { section.hidden = j !== i; });
    buttons.forEach((button, j) => button.setAttribute('aria-pressed', String(i === j)));
    arrange(sections[i]); reset();
  }
  function render() {
    world.style.transform = `translateZ(${perspective}px) rotateX(${camera.pitch}rad) rotateY(${camera.yaw}rad) translate3d(${-camera.x}px,0px,${-camera.z}px)`;
  }
  function resize() {
    // A wider, consistent vertical field of view makes nearby walls easier to read.
    perspective = viewport.clientHeight / (2 * Math.tan(70 * Math.PI / 360));
    viewport.style.perspective = `${perspective}px`;
    render();
  }
  window.addEventListener('resize', resize);
  const movement = new Set(['w', 'a', 's', 'd', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown']);
  const physicalKeys = { KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd' };
  const keyFor = event => physicalKeys[event.code] || event.key.toLowerCase();
  function inViewer() { return document.body.classList.contains('viewing-print'); }
  window.addEventListener('keydown', event => {
    if (touchMode || inViewer() || event.metaKey || event.ctrlKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
    const key = keyFor(event);
    if (movement.has(key)) { event.preventDefault(); keys.add(key); }
  });
  window.addEventListener('keyup', event => keys.delete(keyFor(event)));
  window.addEventListener('blur', () => keys.clear());
  document.addEventListener('visibilitychange', () => keys.clear());
  function updateTouchMode() {
    document.body.classList.toggle('room-touch', touchMode);
    controls.hidden = touchMode;
    hint.textContent = 'click a work to view';
  }
  touchQuery.addEventListener('change', event => {
    touchMode = event.matches; gesture = null; keys.clear();
    updateTouchMode(); reset(); resize();
  });
  let gesture = null, suppressClickUntil = 0;
  viewport.addEventListener('pointerdown', event => {
    if (inViewer() || gesture || !event.isPrimary || !['touch', 'pen'].includes(event.pointerType)) return;
    // A finger still selects touch mode when a tablet has a trackpad attached.
    if (!touchMode) { touchMode = true; updateTouchMode(); reset(); resize(); }
    gesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
    suppressClickUntil = 0;
  });
  viewport.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    if (!gesture.moved) {
      if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) < 8) return;
      gesture.moved = true;
      viewport.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    camera.yaw -= (event.clientX - gesture.lastX) * .004;
    camera.pitch = Math.max(-.7, Math.min(.7, camera.pitch + (event.clientY - gesture.lastY) * .004));
    gesture.lastX = event.clientX; gesture.lastY = event.clientY;
    render();
  });
  function finishGesture(event) {
    if (!gesture || event.pointerId !== gesture.id) return;
    if (gesture.moved) suppressClickUntil = performance.now() + 500;
    gesture = null;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  }
  viewport.addEventListener('pointerup', finishGesture);
  viewport.addEventListener('pointercancel', finishGesture);
  viewport.addEventListener('lostpointercapture', event => {
    if (event.target === viewport) finishGesture(event);
  });
  viewport.addEventListener('click', event => {
    if (event.detail !== 0 && performance.now() < suppressClickUntil) {
      event.preventDefault(); event.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener('blur', () => { gesture = null; });
  document.querySelectorAll('[data-move]').forEach(button => {
    button.addEventListener('pointerdown', event => { event.preventDefault(); keys.add(button.dataset.move); button.setPointerCapture(event.pointerId); });
    const stop = () => keys.delete(button.dataset.move);
    button.addEventListener('pointerup', stop); button.addEventListener('pointercancel', stop);
    button.addEventListener('click', event => { if (event.detail === 0) { keys.add(button.dataset.move); step(.12); keys.delete(button.dataset.move); render(); } });
  });
  function step(dt) {
    if (touchMode || inViewer()) { keys.clear(); return; }
    const has = (...values) => values.some(value => keys.has(value)) ? 1 : 0;
    camera.yaw += (has('arrowright') - has('arrowleft')) * dt * 1.2;
    camera.pitch = Math.max(-1.15, Math.min(1.15, camera.pitch + (has('arrowup') - has('arrowdown')) * dt * 1.2));
    let forward = has('w') - has('s');
    let side = has('d') - has('a');
    const length = Math.hypot(forward, side) || 1;
    forward /= length; side /= length;
    const speed = 1120;
    camera.x += (Math.sin(camera.yaw) * forward + Math.cos(camera.yaw) * side) * dt * speed;
    camera.z += (-Math.cos(camera.yaw) * forward + Math.sin(camera.yaw) * side) * dt * speed;
    camera.x = Math.max(-halfWidth + 240, Math.min(halfWidth - 240, camera.x));
    camera.z = Math.max(backZ + 260, Math.min(960, camera.z));
  }
  const stateKey = 'irreality-view:' + location.pathname;
  window.addEventListener('gallery:save-view', () => {
    try { sessionStorage.setItem(stateKey, JSON.stringify({ series: selectedSeries, camera })); } catch (_) {}
  });
  document.body.classList.add('room-ready'); updateTouchMode(); resize(); select(0);
  try {
    const saved = JSON.parse(sessionStorage.getItem(stateKey));
    if (saved && Number.isInteger(saved.series) && sections[saved.series]) {
      select(saved.series);
      if (Number.isFinite(saved.camera.yaw) && Number.isFinite(saved.camera.pitch)) {
        camera.yaw = saved.camera.yaw;
        camera.pitch = Math.max(-.7, Math.min(.7, saved.camera.pitch));
        render();
      }
    }
    sessionStorage.removeItem(stateKey);
  } catch (_) {}
  function tick(time) {
    const dt = Math.min((time - previous) / 1000, .04); previous = time;
    if (keys.size) { step(dt); render(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
