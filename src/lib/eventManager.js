const eventMap = new Map();

export function setupEventListeners(root) {
  const EVENT = ["click", "mouseover", "focus", "keydown", "keyup", "keypress"];

  EVENT.forEach((eventName) => {
    root.addEventListener(eventName, (e) => {
      let target = e.target;

      while (target && target !== root) {
        if (eventMap.has(target) && eventMap.get(target).has(eventName)) {
          // 이벤트 핸들러가 이미 실행되었다면 추가 실행하지 않음
          if (e.__handled) return;
          e.__handled = true;

          eventMap.get(target).get(eventName)(e);
          return;
        }
        target = target.parentElement;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }
  const elementEvents = eventMap.get(element);

  // 중복 등록 방지: 같은 이벤트가 등록되어 있다면 추가하지 않음
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, handler);
  }
}

export function removeEvent(element, eventType) {
  if (eventMap.has(element)) {
    eventMap.get(element).delete(eventType);
  }
}
