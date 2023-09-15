// Workaround to use the responsive wrapper with jest-dom
// See https://gist.github.com/ErikGMatos/20192d0ee2815a14e8516c16002c6422
let listener: globalThis.ResizeObserverCallback;
class ResizeObserver {
  constructor(ls: globalThis.ResizeObserverCallback) {
    listener = ls;
  }

  observe() {
    return this;
  }

  disconnect() {
    return this;
  }

  unobserve() {}
}

// Only run the shim once when requested
let init = false;

export const mockResizeObserver = () => {
  if (init) return;
  init = true;

  window.ResizeObserver = ResizeObserver;
};

export const resize = () => {
  listener(
    [
      {
        contentRect: {
          width: 800,
          height: 400,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          x: 0,
          y: 0,
          toJSON: () => {
            return {};
          },
        },
        contentBoxSize: [],
        borderBoxSize: [],
        target: document.body,
        devicePixelContentBoxSize: [],
      },
    ],
    new ResizeObserver(listener),
  );
};
