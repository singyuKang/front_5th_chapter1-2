import { addEvent } from "./eventManager";

export const Fragment = Symbol("Fragment");

export function createElement(vNode) {
  // 1. vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    for (const child of vNode) {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    }

    return fragment;
  }

  // Fragment 처리 - type이 Fragment일 경우 DocumentFragment를 생성합니다
  if (vNode.type === Fragment) {
    const fragment = document.createDocumentFragment();
    if (vNode.children && Array.isArray(vNode.children)) {
      for (const child of vNode.children) {
        const childElement = createElement(child);
        fragment.appendChild(childElement);
      }
    }
    return fragment;
  }

  // 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
  //     - vNode.type에 해당하는 요소를 생성
  //     - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  //     - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
  const $element = document.createElement(vNode.type);
  if (Array.isArray(vNode.children)) {
    for (const child of vNode.children) {
      const childElement = createElement(child);
      $element.appendChild(childElement);
    }
  }

  if (vNode.props) {
    for (const [key, value] of Object.entries(vNode.props)) {
      if (value !== undefined && value !== null) {
        if (key === "className") {
          $element.setAttribute("class", value);
        }

        if (key.startsWith("on")) {
          addEvent($element, key.slice(2).toLowerCase(), value);
        }

        if (key !== "className" && !key.startsWith("on")) {
          $element.setAttribute(key, value);
        }
      }
    }
  }

  return $element;
}
