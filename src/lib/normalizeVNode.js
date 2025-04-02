export function normalizeVNode(vNode) {
  // 1. null, undefined, boolean인 경우 빈 문자열 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환합니다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화합니다. JSX형태
  if (typeof vNode.type === "function") {
    const props = { ...vNode.props };
    if (vNode.children && vNode.children.length > 0) {
      props.children = vNode.children;
    }
    return normalizeVNode(vNode.type(props));
  }

  // 4. 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환합니다.
  if (Array.isArray(vNode.children)) {
    vNode.children = vNode.children
      .map(normalizeVNode)
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== false &&
          value !== "",
      );
  }

  return vNode;
}
