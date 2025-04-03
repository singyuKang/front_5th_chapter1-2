import { Fragment } from "./createElement";

export function createVNode(type, props, ...children) {
  // 1. Fragment (<>...</>)을 감지
  if (type === Fragment) {
    return children
      .flat(Infinity)
      .filter(
        (child) => child !== false && child !== null && child !== undefined,
      );
  }

  return {
    type,
    props: props,
    children: children
      .flat(Infinity)
      .filter(
        (child) => child !== false && child !== null && child !== undefined,
      ),
  };
}
