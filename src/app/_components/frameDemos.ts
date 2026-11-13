// Self-playing demos for the app embedded in the home page (a same-origin iframe).
// A demo drives the app on its own; any real input from the visitor (touch, wheel, key, click or mouse movement over the app)
// interrupts it. After the visitor has been idle for a moment the demo starts again from its first state, never from where it
// was cut off. `runFrameDemo` returns a function that stops everything.

const MOUSE_SLOP_PX = 3;
const POLL_MS = 60;

class Interrupted extends Error {}

type FrameWindow = Window & typeof globalThis;

type Ctx = {
  doc: Document;
  win: FrameWindow;
  sleep: (ms: number) => Promise<void>;
  until: <T>(find: () => T | null | undefined | false, timeoutMs?: number) => Promise<T>;
  glide: (apply: (progress: number) => void, ms: number) => Promise<void>;
};

type Demo = {
  resumeAfterMs: number; // idle time after a visitor input before the demo starts over
  reset: (ctx: Ctx) => Promise<void>;
  play: (ctx: Ctx) => Promise<void>;
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ---- helpers that read the app's DOM -------------------------------------------------------------------------------

function findScroller(doc: Document): HTMLElement | undefined {
  return Array.from(doc.querySelectorAll<HTMLElement>("*")).find((element) => {
    const overflow = doc.defaultView?.getComputedStyle(element).overflowY;
    return (overflow === "auto" || overflow === "scroll") && element.scrollHeight > element.clientHeight + 40;
  });
}

function findText(doc: Document, text: string): HTMLElement | undefined {
  return Array.from(doc.querySelectorAll<HTMLElement>("*")).find((element) => element.children.length === 0 && element.textContent?.trim() === text);
}

// The pressable around a label: the nearest ancestor that takes focus.
function pressableOf(element: HTMLElement | undefined): HTMLElement | undefined {
  let node: HTMLElement | null | undefined = element;
  while (node && node.getAttribute("tabindex") === null) node = node.parentElement;
  return node ?? undefined;
}

function findByLabel(doc: Document, label: string): HTMLElement | undefined {
  return doc.querySelector<HTMLElement>(`[aria-label="${label}"]`) ?? undefined;
}

function fire(win: FrameWindow, target: HTMLElement, type: string, pointer = false) {
  const Ctor = pointer ? win.PointerEvent : win.MouseEvent;
  target.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, view: win, pointerType: "mouse" } as PointerEventInit));
}

// A full press: the app's pressables react to the whole pointer sequence, not to a bare click.
function tap(win: FrameWindow, target: HTMLElement) {
  fire(win, target, "pointerdown", true);
  fire(win, target, "mousedown");
  fire(win, target, "pointerup", true);
  fire(win, target, "mouseup");
  fire(win, target, "click");
}

// ---- the demos -----------------------------------------------------------------------------------------------------

// Hive control: glide down to the report and the controls, rest, glide back up, rest, repeat.
const hiveDemo: Demo = {
  resumeAfterMs: 1000,
  async reset({ doc, until }) {
    const scroller = await until(() => findScroller(doc));
    scroller.scrollTop = 0;
  },
  async play({ doc, until, sleep, glide }) {
    const headingTop = () => {
      const scroller = findScroller(doc);
      const heading = findText(doc, "리포트");
      if (!scroller || !heading) return 0;
      const maxTop = scroller.scrollHeight - scroller.clientHeight;
      return Math.min(maxTop, Math.max(0, heading.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 12));
    };
    await until(() => findText(doc, "리포트"));
    for (;;) {
      const target = headingTop();
      const ms = Math.min(3400, Math.max(1700, target * 3.6));
      await glide((progress) => { const scroller = findScroller(doc); if (scroller) scroller.scrollTop = headingTop() * progress; }, ms);
      await sleep(1000);
      await glide((progress) => { const scroller = findScroller(doc); if (scroller) scroller.scrollTop = headingTop() * (1 - progress); }, ms);
      await sleep(1000);
    }
  },
};

// Gate control: press the "개화 60% 이상" card, show its sheet, close it, visit the report tab, come back.
const gateDemo: Demo = {
  resumeAfterMs: 1000,
  async reset({ doc, win, until, sleep }) {
    const close = findByLabel(doc, "NFC 카드 닫기");
    if (close) { tap(win, close); await sleep(500); }
    const tab = pressableOf(await until(() => findText(doc, "개폐기")));
    if (tab) { tap(win, tab); await sleep(300); }
    const scroller = findScroller(doc);
    if (scroller) scroller.scrollTop = 0;
  },
  async play({ doc, win, until, sleep, glide }) {
    await sleep(700);
    const card = pressableOf(await until(() => findText(doc, "개화 60% 이상")));
    if (!card) return;

    // Bring the card into view if the screen is short.
    const scroller = findScroller(doc);
    if (scroller) {
      const box = card.getBoundingClientRect();
      const view = scroller.getBoundingClientRect();
      if (box.bottom > view.bottom - 24 || box.top < view.top + 24) {
        const from = scroller.scrollTop;
        const to = from + (box.top - view.top) - view.height / 3;
        await glide((progress) => { scroller.scrollTop = from + (to - from) * progress; }, 900);
        await sleep(300);
      }
    }

    // Hover, press, release: the card shows its hover and pressed colours before the sheet opens.
    fire(win, card, "pointerover", true);
    fire(win, card, "mouseover");
    await sleep(700);
    fire(win, card, "pointerdown", true);
    fire(win, card, "mousedown");
    await sleep(260);
    fire(win, card, "pointerup", true);
    fire(win, card, "mouseup");
    fire(win, card, "click");

    await until(() => findByLabel(doc, "NFC 카드 닫기"), 4000);
    await sleep(2400);
    const close = findByLabel(doc, "NFC 카드 닫기");
    if (close) tap(win, close);
    await sleep(900);

    const report = pressableOf(await until(() => findText(doc, "리포트")));
    if (report) tap(win, report);
    await sleep(3000);
    const back = pressableOf(await until(() => findText(doc, "개폐기")));
    if (back) tap(win, back);
    await sleep(900);
  },
};

export const frameDemos = { hive: hiveDemo, gate: gateDemo } as const;
export type FrameDemoName = keyof typeof frameDemos;

// ---- the runner ----------------------------------------------------------------------------------------------------

export function runFrameDemo(frame: HTMLIFrameElement, name: FrameDemoName, onStart?: () => void): () => void {
  const win = frame.contentWindow as FrameWindow | null;
  const doc = frame.contentDocument;
  if (!win || !doc) return () => {};
  const demo = frameDemos[name];

  let cancelled = false;
  let epoch = 0; // bumps on every visitor input, which aborts whatever the demo is waiting on
  let lastActivity = 0;
  let lastMouse: { x: number; y: number } | undefined;
  let raf = 0;

  const activity = (event: Event) => {
    if (!event.isTrusted) return; // the demo's own synthetic events do not count
    epoch += 1;
    lastActivity = performance.now();
  };
  // Chrome may fire a synthetic mousemove while the page scrolls under a resting cursor, so only a real move counts.
  const onMouseMove = (event: MouseEvent) => {
    if (!event.isTrusted) return;
    if (!lastMouse) { lastMouse = { x: event.clientX, y: event.clientY }; return; }
    if (Math.hypot(event.clientX - lastMouse.x, event.clientY - lastMouse.y) < MOUSE_SLOP_PX) return;
    lastMouse = { x: event.clientX, y: event.clientY };
    activity(event);
  };
  const inputs = ["wheel", "touchstart", "touchmove", "pointerdown", "keydown"] as const;
  inputs.forEach((type) => win.addEventListener(type, activity, { capture: true, passive: true }));
  win.addEventListener("mousemove", onMouseMove, { capture: true, passive: true });

  const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  const makeCtx = (): Ctx => {
    const mine = epoch;
    const check = () => { if (cancelled || epoch !== mine) throw new Interrupted(); };
    return {
      doc,
      win,
      async sleep(ms) {
        const end = performance.now() + ms;
        while (performance.now() < end) { check(); await wait(Math.min(50, Math.max(0, end - performance.now()))); }
        check();
      },
      async until(find, timeoutMs = 8000) {
        const end = performance.now() + timeoutMs;
        for (;;) {
          check();
          const found = find();
          if (found) return found;
          if (performance.now() > end) throw new Interrupted();
          await wait(POLL_MS);
        }
      },
      glide(apply, ms) {
        return new Promise<void>((resolve, reject) => {
          const started = performance.now();
          const tick = (now: number) => {
            try { check(); } catch (error) { reject(error); return; }
            const progress = Math.min(1, Math.max(0, (now - started) / ms));
            apply(easeInOut(progress));
            if (progress < 1) raf = requestAnimationFrame(tick);
            else resolve();
          };
          raf = requestAnimationFrame(tick);
        });
      },
    };
  };

  void (async () => {
    let started = false;
    while (!cancelled) {
      try {
        const ctx = makeCtx();
        await demo.reset(ctx);
        if (!started) { started = true; onStart?.(); }
        await demo.play(ctx);
      } catch (error) {
        if (!(error instanceof Interrupted)) console.warn("[frame demo]", error);
        // After an interruption wait until the visitor has been idle, then play again from the first state.
        while (!cancelled && performance.now() - lastActivity < demo.resumeAfterMs) await wait(200);
        await wait(300);
      }
    }
  })();

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    inputs.forEach((type) => win.removeEventListener(type, activity, true));
    win.removeEventListener("mousemove", onMouseMove, true);
  };
}
