import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const containerNodeMap = new Map();

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  // 1. VNode 정규화
  // 2. DOM 요소 생성
  // 3. 컨테이너에 삽입
  // 4. 이벤트 리스너 설정
  const normalizedNode = normalizeVNode(vNode);

  if (!containerNodeMap.has(container)) {
    const element = createElement(normalizedNode);
    container.innerHTML = "";
    container.appendChild(element);
  }

  if (containerNodeMap.has(container)) {
    const prevNode = containerNodeMap.get(container);
    updateElement(container, normalizedNode, prevNode);
  }

  setupEventListeners(container);
  containerNodeMap.set(container, normalizedNode);
}
