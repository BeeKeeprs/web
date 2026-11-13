import * as THREE from "three";

export type AirRippleController = { dispose: () => void };

const COLS = 200;
const PHOTO = "/images/hero-greenhouse-plate.webp";
/** Crop focus (from the top-left). Wide stages keep the bench on the right under the product render; narrow stages show the aisle behind the copy. */
const FOCUS_X = .28, FOCUS_X_NARROW = .2, FOCUS_Y = .55;
/** Crops in past a plain cover fit so the soft green aisle fills the stage and only a few strawberries show. */
const ZOOM = 1.7;
/** Blur radius (photo pixels) for the softened right side. */
const BLUR = 3;

/** Cursor-driven air ripple that bends the hero greenhouse photo. */
export function createAirRippleScene(host: HTMLElement, surface: HTMLElement): AirRippleController {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  // Inline sizing keeps the canvas from feeding its own ResizeObserver if the stylesheet is late.
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let cols = COLS, rows = 100;
  let current = new Float32Array(cols * rows), previous = new Float32Array(cols * rows);
  let pixels = new Uint8Array(cols * rows * 4);
  let texture = new THREE.DataTexture(pixels, cols, rows);
  const uniforms = {
    field: { value: texture }, texel: { value: new THREE.Vector2(1 / cols, 1 / rows) },
    photo: { value: null as THREE.Texture | null }, blurred: { value: null as THREE.Texture | null }, cover: { value: new THREE.Vector4(1, 1, 0, 0) },
    ready: { value: 0 }, narrow: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform sampler2D field;uniform sampler2D photo;uniform sampler2D blurred;uniform vec2 texel;uniform vec4 cover;uniform float ready;uniform float narrow;
      float h(vec2 p){return texture2D(field,p).r*2.-1.;}
      void main(){
        vec2 slope=vec2(h(vUv+vec2(texel.x,0.))-h(vUv-vec2(texel.x,0.)),h(vUv+vec2(0.,texel.y))-h(vUv-vec2(0.,texel.y)));
        float bend=length(slope);
        vec2 uv=(vUv+slope*.02)*cover.xy+cover.zw;
        // The photo's own depth of field softens the left; soften the right to match so the product render reads as the only sharp layer.
        float soft=smoothstep(.4,.95,vUv.x);
        vec3 picture=mix(texture2D(photo,uv).rgb,texture2D(blurred,uv).rgb,soft);
        // Wide stages: the right side stays in full sunlight behind the product render; the left fades to green where the headline and copy sit.
        // Narrow stages: the copy spans the whole photo, so it is shaded evenly.
        float side=smoothstep(.6,.08,vUv.x)*.82+smoothstep(.55,1.,vUv.y)*smoothstep(.75,.3,vUv.x)*.12;
        vec3 shade=mix(picture,vec3(.149,.239,.204),mix(min(.92,side),.8,narrow));
        // Lift the right side behind the product so it reads bright and airy.
        shade*=1.+.08*soft*(1.-narrow);
        float alpha=ready;
        float glint=pow(clamp(dot(normalize(vec3(-slope*6.,1.)),normalize(vec3(-.45,.6,.65))),0.,1.),48.)*smoothstep(.01,.08,bend)*.16*alpha;
        gl_FragColor=vec4(shade*alpha+vec3(.835,.871,.706)*glint,min(1.,alpha+glint));
      }`,
  });
  material.premultipliedAlpha = true;
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  let photoAspect = 1774 / 887, aspect = 0;
  function fitCover() {
    if (!aspect) return;
    // Scale UVs so the photo covers the stage at ZOOM, cropping around the focus point.
    const clamp = (start: number, span: number) => Math.min(1 - span, Math.max(0, start));
    const spanX = (aspect > photoAspect ? 1 : aspect / photoAspect) / ZOOM;
    const spanY = (aspect > photoAspect ? photoAspect / aspect : 1) / ZOOM;
    const focusX = aspect < 1 ? FOCUS_X_NARROW : FOCUS_X;
    uniforms.cover.value.set(spanX, spanY, clamp(focusX - spanX / 2, spanX), clamp(1 - FOCUS_Y - spanY / 2, spanY));
  }
  let blurred: THREE.CanvasTexture | null = null;
  const photo = new THREE.TextureLoader().load(PHOTO, loaded => {
    const image = loaded.image as HTMLImageElement;
    photoAspect = image.width / image.height;
    blurred = new THREE.CanvasTexture(blurPhoto(image));
    uniforms.blurred.value = blurred;
    fitCover(); uniforms.ready.value = 1; dirty = true;
  });
  uniforms.photo.value = photo;
  uniforms.blurred.value = photo;

  /** A one-off lens-style blur of the photo. Edges are padded with a stretched copy so the blur doesn't darken them. */
  function blurPhoto(image: HTMLImageElement) {
    const w = image.width, h = image.height, pad = BLUR * 3;
    const padded = document.createElement("canvas");
    padded.width = w + pad * 2; padded.height = h + pad * 2;
    const context = padded.getContext("2d")!;
    context.drawImage(image, 0, 0, padded.width, padded.height);
    context.drawImage(image, pad, pad);
    const soft = document.createElement("canvas");
    soft.width = padded.width; soft.height = padded.height;
    const softContext = soft.getContext("2d")!;
    softContext.filter = `blur(${BLUR}px)`;
    softContext.drawImage(padded, 0, 0);
    const out = document.createElement("canvas");
    out.width = w; out.height = h;
    out.getContext("2d")!.drawImage(soft, pad, pad, w, h, 0, 0, w, h);
    return out;
  }

  function allocate() {
    cols = COLS; rows = Math.max(40, Math.round(COLS / aspect));
    current = new Float32Array(cols * rows); previous = new Float32Array(cols * rows);
    pixels = new Uint8Array(cols * rows * 4);
    for (let k = 0; k < cols * rows; k++) pixels[k * 4] = 128;
    texture.dispose();
    texture = new THREE.DataTexture(pixels, cols, rows);
    texture.magFilter = texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    uniforms.field.value = texture; uniforms.texel.value.set(1 / cols, 1 / rows);
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    const next = rect.width / rect.height;
    if (Math.abs(next - aspect) > .02) { aspect = next; allocate(); }
    uniforms.narrow.value = aspect < 1 ? 1 : 0;
    fitCover(); dirty = true;
  }

  function disturb(x: number, y: number, amount: number) {
    const cx = x * cols, cy = (1 - y) * rows, r = 1.8;
    for (let j = Math.max(1, Math.floor(cy - r)); j <= Math.min(rows - 2, Math.ceil(cy + r)); j++) {
      for (let i = Math.max(1, Math.floor(cx - r)); i <= Math.min(cols - 2, Math.ceil(cx + r)); i++) {
        const d = Math.hypot(i - cx, j - cy) / r;
        if (d < 1) current[j * cols + i] += amount * (1 - d * d);
      }
    }
  }

  let lastX = -1, lastY = -1, idle = 0;
  function move(event: PointerEvent) {
    const rect = host.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) { lastX = -1; return; }
    if (lastX >= 0) {
      const distance = Math.hypot((x - lastX) * cols, (y - lastY) * rows);
      const steps = Math.min(24, Math.ceil(distance / 1.5));
      const amount = Math.min(.24, .05 + distance * .008);
      for (let s = 1; s <= steps; s++) disturb(lastX + (x - lastX) * s / steps, lastY + (y - lastY) * s / steps, amount / Math.sqrt(steps));
    }
    lastX = x; lastY = y; idle = 0; active = true;
  }
  function leave() { lastX = -1; }

  function step() {
    for (let j = 1; j < rows - 1; j++) {
      for (let i = 1; i < cols - 1; i++) {
        const k = j * cols + i;
        previous[k] = ((current[k - 1] + current[k + 1] + current[k - cols] + current[k + cols]) * .5 - previous[k]) * .972;
      }
    }
    const swap = current; current = previous; previous = swap;
  }

  let energy = 0;
  function upload() {
    energy = 0;
    for (let k = 0; k < current.length; k++) {
      const v = current[k];
      energy += v * v;
      pixels[k * 4] = Math.max(0, Math.min(255, 128 + v * 160));
    }
    texture.needsUpdate = true;
  }

  let disposed = false, visible = true, active = true, lost = false, dirty = true;
  let frame = 0, last = performance.now(), accumulator = 0;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; dirty = true; }); observer.observe(surface);
  function contextLost(event: Event) { event.preventDefault(); lost = true; }
  function contextRestored() { lost = false; dirty = true; }
  function change() { dirty = true; }
  surface.addEventListener("pointermove", move, { passive: true });
  surface.addEventListener("pointerleave", leave);
  preference.addEventListener("change", change);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
  resize();

  function render(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!visible || document.hidden || lost) return;
    const still = preference.matches;
    if (!still) {
      idle += dt;
      // A soft breath every few seconds so the field reads as air before anyone moves the cursor.
      if (idle > 3.2) { disturb(.55 + Math.random() * .35, .25 + Math.random() * .5, .12); idle = 0; active = true; }
    }
    if (!(active && !still) && !dirty) return;
    if (active && !still) {
      accumulator += dt;
      while (accumulator >= 1 / 60) { step(); accumulator -= 1 / 60; }
      upload();
      if (energy < .0005) active = false;
    }
    renderer.render(scene, camera); dirty = false;
  }
  frame = requestAnimationFrame(render);

  return {
    dispose() {
      disposed = true; cancelAnimationFrame(frame);
      observer.disconnect(); resizeObserver.disconnect();
      surface.removeEventListener("pointermove", move); surface.removeEventListener("pointerleave", leave);
      preference.removeEventListener("change", change);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
      texture.dispose(); photo.dispose(); blurred?.dispose(); quad.geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
