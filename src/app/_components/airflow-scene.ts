import * as THREE from "three";

export type AirflowController = { setPaused: (paused: boolean) => void; dispose: () => void };

/** Transparent airflow only. Coordinates match the unmodified 1774 × 887 photograph. */
export function createAirflowScene(host: HTMLElement, surface: HTMLElement): AirflowController {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1774, 0, 887, .1, 50);
  camera.position.z = 10;
  const uniforms = { time: { value: 0 }, energy: { value: .3 } };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;uniform float time;uniform float energy;
      void main(){vUv=uv;vec3 p=position;
      p.y+=sin(uv.x*8.-time*1.7+position.y*.025)*9.*energy*uv.x;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform float time;uniform float energy;
      void main(){float edge=pow(max(0.,1.-abs(vUv.y*2.-1.)),2.);
      float ends=smoothstep(0.,.15,vUv.x)*(1.-smoothstep(.65,1.,vUv.x));
      float pulse=.45+.55*pow(.5+.5*sin(vUv.x*13.-time*2.5),3.);
      gl_FragColor=vec4(.66,.93,.79,edge*ends*pulse*(.2+energy*.13));}`,
  });
  const geometries: THREE.BufferGeometry[] = [];
  function ribbon(index: number, inlet: boolean) {
    const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
    for (let i = 0; i <= 64; i++) {
      const u = i / 64;
      const x = inlet ? 5 + u * 160 : 900 + u * 335;
      const y = inlet ? 290 + index * 43 + Math.sin(u * 4 + index) * 13 : 315 + index * 23 + u * 75 + Math.sin(u * 5 + index * .8) * u * 18;
      const halfWidth = inlet ? 4 : 4 + Math.sin(u * Math.PI) * 7;
      positions.push(x, y - halfWidth, 0, x, y + halfWidth, 0);
      uvs.push(u, 0, u, 1);
      if (i < 64) { const k = i * 2; indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometries.push(geometry);
    scene.add(new THREE.Mesh(geometry, material));
  }
  for (let i = 0; i < 9; i++) ribbon(i, false);
  for (let i = 0; i < 5; i++) ribbon(i, true);

  let disposed = false, visible = true, paused = false, dirty = true, lost = false;
  let frame = 0, last = 0, time = 0, energy = .3;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const extraX = Math.max(0, (887 * aspect - 1774) / 2);
    const extraY = Math.max(0, (1774 / aspect - 887) / 2);
    camera.left = -extraX; camera.right = 1774 + extraX;
    camera.top = -extraY; camera.bottom = 887 + extraY;
    camera.updateProjectionMatrix(); dirty = true;
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; dirty = true; }); observer.observe(surface);
  function enter() { energy = 1; }
  function leave() { energy = .3; }
  function change() { dirty = true; }
  function contextLost(event: Event) { event.preventDefault(); lost = true; }
  function contextRestored() { lost = false; dirty = true; }
  surface.addEventListener("pointerenter", enter); surface.addEventListener("pointerleave", leave);
  preference.addEventListener("change", change);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
  resize();
  function render(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!visible || document.hidden || lost || ((paused || preference.matches) && !dirty)) return;
    if (!paused && !preference.matches) {
      time += dt;
      uniforms.energy.value = THREE.MathUtils.lerp(uniforms.energy.value, energy, 1 - Math.exp(-dt * 3));
    }
    uniforms.time.value = time;
    renderer.render(scene, camera); dirty = false;
  }
  render(performance.now());
  return {
    setPaused(value) { paused = value; dirty = true; },
    dispose() {
      disposed = true; cancelAnimationFrame(frame);
      observer.disconnect(); resizeObserver.disconnect();
      surface.removeEventListener("pointerenter", enter); surface.removeEventListener("pointerleave", leave);
      preference.removeEventListener("change", change);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
      geometries.forEach(geometry => geometry.dispose()); material.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
