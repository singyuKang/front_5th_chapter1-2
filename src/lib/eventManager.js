// eventMap
//  ├── button
//  │    ├── "click" → { handleClick }

// rootEventMap
//  ├── "click" → rootListener (document.body에 이벤트 등록)
const eventMap = new Map();
const rootEventMap = new Map();

export function setupEventListeners(root) {
  rootEventMap.forEach((listener, eventType) => {
    if (listener) return;
    const rootListener = (event) => {
      let target = event.target;
      while (target) {
        const handlersMap = eventMap.get(target);
        if (handlersMap && handlersMap.has(event.type)) {
          handlersMap.get(event.type).forEach((handler) => handler(event));
        }
        if (target === event.currentTarget) break;
        target = target.parentNode;
      }
    };
    rootEventMap.set(eventType, rootListener);
    root.addEventListener(eventType, rootListener);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }
  const handlersMap = eventMap.get(element);
  if (!handlersMap.has(eventType)) {
    handlersMap.set(eventType, new Set());
  }
  handlersMap.get(eventType).add(handler);
  if (!rootEventMap.has(eventType)) {
    rootPreRegister(eventType);
  }
}

function rootPreRegister(eventType) {
  rootEventMap.set(eventType, null);
  setupEventListeners(document.body);
}

export function removeEvent(element, eventType, handler) {
  const handlersMap = eventMap.get(element);
  if (!handlersMap) return;

  const handlers = handlersMap.get(eventType);
  if (!handlers) return;

  handlers.delete(handler);
  if (handlers.size === 0) {
    handlersMap.delete(eventType);
    if (handlersMap.size === 0) {
      eventMap.delete(element);
    }
  }
}
