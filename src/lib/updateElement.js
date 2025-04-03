import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) return;

  // 기존 이벤트 제거
  for (const [attr, value] of Object.entries(originOldProps)) {
    if (attr.startsWith("on")) {
      const eventType = attr.slice(2).toLowerCase();
      removeEvent(target, eventType, value);
    }
  }

  // 속성 및 이벤트 추가
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === value) continue;

    if (attr.startsWith("on")) {
      const eventType = attr.slice(2).toLowerCase();
      addEvent(target, eventType, value);
    }
    if (attr === "className") {
      target.setAttribute("class", value);
    }
    if (attr !== "className" && !attr.startsWith("on")) {
      target.setAttribute(attr, value);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // parentElement 확인
  if (!parentElement) return;

  // 1. oldNode만 있는 경우
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    if (!parentElement || !parentElement.childNodes[index]) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const newNodeChLength = newNode.children?.length ?? 0;
  const oldNodeChLenght = oldNode.children?.length ?? 0;
  const maxLength = Math.max(newNodeChLength, oldNodeChLenght);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
