// import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 달라지거나 추가된 Props를 반영
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === originNewProps[attr]) continue;
    target.setAttribute(attr, value);
  }

  // 없어진 props를 attribute에서 제거
  for (const attr of Object.keys(originOldProps)) {
    if (originNewProps[attr] !== undefined) continue;
    target.removeAttribute(attr);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // parentElement 확인
  if (!parentElement) return;

  // 1. oldNode만 있는 경우
  if (!newNode && oldNode) {
    return parent.removeChild(parent.childNode[index]);
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parent.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index],
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index],
    );
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
