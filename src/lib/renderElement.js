import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  // 1. VNode 정규화
  const normalizedNode = normalizeVNode(vNode);

  // 2. DOM 요소 생성
  const element = createElement(normalizedNode);

  // 3. 컨테이너에 삽입
  container.innerHTML = ""; // 기존 내용 제거
  container.appendChild(element);

  // 4. 이벤트 리스너 설정
  setupEventListeners(container);
}
