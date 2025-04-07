## 과제 체크포인트
### 배포 링크

https://singyukang.github.io/front_5th_chapter1-2/

### 기본과제

#### 가상돔을 기반으로 렌더링하기

- [x] createVNode 함수를 이용하여 vNode를 만든다.
- [x] normalizeVNode 함수를 이용하여 vNode를 정규화한다.
- [x] createElement 함수를 이용하여 vNode를 실제 DOM으로 만든다.
- [x] 결과적으로, JSX를 실제 DOM으로 변환할 수 있도록 만들었다.

#### 이벤트 위임

- [x] 노드를 생성할 때 이벤트를 직접 등록하는게 아니라 이벤트 위임 방식으로 등록해야 한다
- [x] 동적으로 추가된 요소에도 이벤트가 정상적으로 작동해야 한다
- [x] 이벤트 핸들러가 제거되면 더 이상 호출되지 않아야 한다

### 심화 과제

#### 1) Diff 알고리즘 구현

- [x] 초기 렌더링이 올바르게 수행되어야 한다
- [x] diff 알고리즘을 통해 변경된 부분만 업데이트해야 한다
- [x] 새로운 요소를 추가하고 불필요한 요소를 제거해야 한다
- [x] 요소의 속성만 변경되었을 때 요소를 재사용해야 한다
- [x] 요소의 타입이 변경되었을 때 새로운 요소를 생성해야 한다

#### 2) 포스트 추가/좋아요 기능 구현

- [x] 비사용자는 포스트 작성 폼이 보이지 않는다
- [x] 비사용자는 포스트에 좋아요를 클릭할 경우, 경고 메세지가 발생한다.
- [x] 사용자는 포스트 작성 폼이 보인다.
- [x] 사용자는 포스트를 추가할 수 있다.
- [x] 사용자는 포스트에 좋아요를 클릭할 경우, 좋아요가 토글된다.

## 과제 셀프회고

`normalizeVNode함수`를 통해 `VNode`의 정규화, `createElement`을 통해 DOM 요소 생성, `eventManager`을 통해 이벤트 등록과 제거, `Diff 알고리즘`을 통해 이전노드와 새로운 노드 비교후 바뀐 부분만 렌더링 등을 `javascript`만을 이용하여 구현했다는 점이 기억에 남고, `React`의 렌더링 방식에 대해 조금이라도 가까워 진거같아 만족스러운 과제였습니다!

`normalizeVNode`, `createElement` 구현할때 `재귀함수`에 대해 적용하는 부분이 시간이 가장 오래걸렸던것같고, `이벤트 위임`을 하는 이유, `자료구조`에 대한 선택, `이벤트 버블링`, `이벤트 캡쳐링`, `fragment` 처리 등 많은 시도를 해보았던 과제인거같습니다.


## 기술적 성장 + 내용정리 + 문제점 정리 + 새롭게 시도한점

# **(1) `normalizeVNode` 구현 - JSX 함수 처리 + 재귀 함수 이해**
```javascript
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
```
해당 함수를 구현하면서 가장 어려웠던 부분은 `함수(vNode.type === "function")` 에 대한 처리 부분과  `vNode.children`을 재귀적으로 표준화하는 부분이 이해하는데 오래 걸렸던것 같습니다.

`재귀함수`를 보자마자 생각이 났던것은 `DFS알고리즘`이었으며, 자료를 찾아보며 작동방식을 차근차근 따라가 보았습니다. 이때 공통된 규칙이 있었는데 아래 내용을 보면

`가장 깊은곳을 만났을때에 대한 처리` , `가장 처음 해줘야 하는것` 에 집중을 하는 부분이었습니다.
```javascript
// 가장 깊은곳
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
```
```javascript
 // 처음과 그 외의 부분
  if (typeof vNode.type === "function") {
    const props = { ...vNode.props };
    if (vNode.children && vNode.children.length > 0) {
      props.children = vNode.children;
    }
    return normalizeVNode(vNode.type(props));
  }

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
```
가장 밑바닥인 `vNode`는 원하는 형태의 데이터로 변환해준뒤 반환을 해주고, 가장 처음 해줘야 하는것인 `vNode.type`이 `함수(JSX)`, `vNode`가 자식이 있는 경우에 대한 처리에 집중하며 구현을 하였습니다.

`함수` 인 경우에 해당 함수를 호출하여 표준화한다 → 이 부분을 이해하는데 오래 걸렸는데 
![스크린샷 2025-04-03 오후 4 22 28](https://github.com/user-attachments/assets/99f913b0-3af5-4aed-a8ec-7de80a8bc1a8)
`renderElement(<Page />, $root)` 을 실행시키면 `<Page />` → vNode를
normalizeVNode함수로 받게 되고 JSX형태에서 vNode.type() 를 통해 다시 normalizeVNode로 들어가게 됩니다. 그러면은
![스크린샷 2025-04-03 오후 4 23 34](https://github.com/user-attachments/assets/131ffd13-1a8d-4ae4-8177-62d62b4f7a16)
vNode.type() → return (<div></div>) 를 받아 위의 사진처럼 createVNode 형태가 되는것입니다.

`children` 이 자식이 있는경우(Array)
vNode.children → 는 결국 Array 형태로 반환을 받아야 합니다. 이를 위해 map 함수를 사용하게 되었고 각 children요소 normalizeVNode를 다시 호출하게 되며 원하는 끝의 형태 → “가장 깊은곳을 만났을때의 처리” 를 반환받게 됩니다. 끝까지 작업이 완료된 vNode.children을 다시 할당을 해주어 기능을 마무리하게 됩니다.
```javascript
vNode.children = vNode.children
      .map(normalizeVNode)
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== false &&
          value !== "",
      );
```

# **(2)  `이벤트 등록 위임`을 하는 이유가 뭘까?**

`button` `1000개`에 `click` 이벤트를 `각각` 등록을 한다고 가정을 해보자
```javascript
// ❌ 개별 요소에 이벤트 리스너를 등록하는 경우
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => console.log("버튼 클릭!"));
});
```
그렇다면은 `1000개`의 버튼 모두의 함수 객체가 생성이되고, 새로운 버튼이 추가 될때마다 개별요소에 `addEventListener`를 추가를 해야합니다. 그렇게 되면은 `메모리 낭비`와 `안좋은 성능`을 가져오게 됩니다.
```javascript
// ✅ 이벤트 위임을 사용한 경우 (루트에서 한 번만 등록)
document.body.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    console.log("버튼 클릭!");
  }
});
```
그렇기 때문에 `개별 요소`에 이벤트를 직접 붙이는 대신, `최상위 컨터이너`에 이벤트 리스너를 등록을하여 `모든 하위 요소의 이벤트를 한곳에서 처리`하도록 하는것입니다. 이렇게 되면은 단, `하나의 리스너`만으로 `1000개`의 버튼 클릭 이벤트를 처리할 수 있어 성능과 메모리 효율성이 좋아지는 결과로 이어집니다.


```javascript
    it("이벤트가 위임 방식으로 등록되어야 한다", () => {
      const clickHandler = vi.fn();
      const button = document.createElement("button");
      container.appendChild(button);

      addEvent(button, "click", clickHandler);
      setupEventListeners(container);
      button.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);

      const handleClick = (e) => e.stopPropagation();
      button.addEventListener("click", handleClick);
      button.click();
      expect(clickHandler).toHaveBeenCalledTimes(1);

      expect(clickHandler).toHaveBeenCalledTimes(1);
      button.removeEventListener("click", handleClick);
      button.click();
      expect(clickHandler).toHaveBeenCalledTimes(2);
    });

   const handleClick = (e) => e.stopPropagation(); //이벤트가 부모로 전파되지 않도록 차단.
   button.addEventListener("click", handleClick);
   button.click();
   expect(clickHandler).toHaveBeenCalledTimes(1);

```

위의 테스트 코드에서 `addEvent(button, "click", clickHandler)`을 통해 한번의 이벤트 등록후, `setupEventListeners()`를 실행하여 `부모요소`에 이벤트를 위임하도록 합니다.
만약에 위임 방식이 아닌 각각 이벤트를 설정하는 방식이었다면 값은 `2회`로 호출이 되었을 것 

✅ 결론: `이벤트 위임`이 효율적이다!

- 개별 요소에 이벤트를 직접 붙이는 방식은 성능 저하 및 메모리 낭비
- 이벤트 위임을 사용하면은 한 곳에서 모든 하위 요소의 이벤트 처리 가능!

# (3) 이벤트 등록 과정 그림, 자료구조 선택
```
📌 이벤트 등록 과정
---------------------------------------------------
1. addEvent(button, "click", handleClick);
   
   eventMap:
   ┌──────────────────┐
   | button → {       |
   |   "click" → [handleClick] |
   | }                |
   └──────────────────┘
   
2. rootPreRegister("click");
   rootEventMap:
   ┌──────────────────┐
   | "click" → null   | (이후 setupEventListeners 실행됨)
   └──────────────────┘

3. setupEventListeners(document.body);
   document.body에 "click" 리스너 추가됨
---------------------------------------------------

📌 이벤트 실행 과정 (버튼 클릭 시)
---------------------------------------------------
[사용자가 버튼 클릭]
   ▼
1. document.body에서 등록한 rootListener 실행
   ▼
2. event.target에서 이벤트 버블링 시작 (button부터 상위 요소로 이동)
   ▼
3. button의 eventMap에서 "click" 핸들러 확인
   ┌──────────────────┐
   | button → {       |
   |   "click" → [handleClick] |
   | }                |
   └──────────────────┘
   - handleClick 실행됨 (console.log 출력됨)
   ▼
4. 부모 노드로 이동하여 반복 (body → document)
---------------------------------------------------
```
이벤트 구현 시 기존에는 객체를 배열 형태로 저장하여 이벤트를 관리하려고 진행을 했었습니다. 하지만 중간 과정에서 등록이 안되는 오류를 발견하였고, 다른분들의 코드를 한번 보고 진행을 해보자 하여 코드들을 살펴보았는데 `Map Set`자료구조를 사용한 경우가 많았습니다. 왜 `Map`을 선택했는지 조사해본 결과, `element`는 독립적인 유일한 요소이므로 키값으로 적절하게 활용할 수 있었으며, 배열의 탐색 시간이 O(n)인 반면, `Map`은 O(1)로 더 빠르게 접근할 수 있다는 점이 있었습니다. 이를 통해 적절한 자료구조의 선택의 중요성?! 을 다시 한번 알게 되었습니다.

# (4) `이벤트 버블링` vs `이벤트 캡쳐링`
```javascript
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
```
이번 과제는 `이벤트 버블링` 구현으로 이벤트 발생시 `targetNode`로 접근하여 하나하나 위로 올라가면서 이벤트를 발생시키는 방식이었습니다. 여기서 저는 `제일 하단에서 상위로 올라가는 방식이 있다면은 그 반대도 있지 않을까?` 하여 자료를 찾아보게 되었고, 코치님이 주신 발제자료를 살펴보니 `이벤트 버블링`에 반대인 `이벤트 캡쳐링` 방식이 있는것을 확인하여 이를 구현을 시작해 보았습니다.

```javascript
export function setupEventListenersCapturing(root) {
  rootEventMap.forEach((listener, eventType) => {
    if (listener) return;

    const rootListener = (event) => {
      // 이벤트 발생 요소부터 시작
      traverseDown(event.target, event);
    };

    rootEventMap.set(eventType, rootListener);
    root.addEventListener(eventType, rootListener);
  });
}

// 하위 요소로 이벤트를 전파하는 함수
export function traverseDown(element, event) {
  // 현재 요소의 이벤트 핸들러 실행
  const handlersMap = eventMap.get(element);
  if (handlersMap && handlersMap.has(event.type)) {
    handlersMap.get(event.type).forEach((handler) => handler(event));
  }

  // 자식 요소들에 대해 재귀적으로 적용
  if (element.children && element.children.length > 0) {
    Array.from(element.children).forEach((child) => {
      traverseDown(child, event);
    });
  }
}
```
`이벤트 버블링` 방식과 유사하게 `eventType` 을 통해 이벤트 저장, `root` 에 이벤트등록을 진행을 해줍니다.
 `이벤트 발생시` `traverseDown` 함수가 실행을 하게 되고 `Map` 에 저장되어 있는 이벤트 → 발생
그후 해당요소에 자식요소들이 있다면은 `재귀 함수`를 통해 그 자식 요소가 가지고 있는 `이벤트` 를 발생하도록 구현하였습니다.


```javascript
    it("이벤트가 상위 요소에서 하위 요소로 전파되어야 한다", () => {
      const parent = document.createElement("div");
      const child = document.createElement("div");
      const grandchild = document.createElement("button");

      parent.appendChild(child);
      child.appendChild(grandchild);
      container.appendChild(parent);

      // 각 요소에 이벤트 핸들러 추가
      const parentHandler = vi.fn();
      const childHandler = vi.fn();
      const grandchildHandler = vi.fn();

      addEvent(parent, "click", parentHandler);
      addEvent(child, "click", childHandler);
      addEvent(grandchild, "click", grandchildHandler);

      // 이벤트 리스너 설정
      setupEventListenersCapturing(container);

      // 테스트 1: 최상위 요소(parent)에 이벤트를 발생시키면 모든 하위 요소로 전파되어야 함
      const event1 = new MouseEvent("click");
      traverseDown(parent, event1);

      expect(parentHandler).toHaveBeenCalledTimes(1);
      expect(childHandler).toHaveBeenCalledTimes(1);
      expect(grandchildHandler).toHaveBeenCalledTimes(1);

      // 모든 호출 기록 초기화
      parentHandler.mockClear();
      childHandler.mockClear();
      grandchildHandler.mockClear();

      // 테스트 2: 중간 요소(child)에 이벤트를 발생시키면 자신과 하위 요소만 영향을 받아야 함
      const event2 = new MouseEvent("click");
      traverseDown(child, event2);

      expect(parentHandler).toHaveBeenCalledTimes(0); // parent는 호출되지 않아야 함
      expect(childHandler).toHaveBeenCalledTimes(1); // child는 호출되어야 함
      expect(grandchildHandler).toHaveBeenCalledTimes(1); // grandchild도 호출되어야 함

      // 모든 호출 기록 초기화
      parentHandler.mockClear();
      childHandler.mockClear();
      grandchildHandler.mockClear();

      // 테스트 3: 최하위 요소(grandchild)에 이벤트를 발생시키면 자신만 영향을 받아야 함
      const event3 = new MouseEvent("click");
      traverseDown(grandchild, event3);

      expect(parentHandler).toHaveBeenCalledTimes(0); // parent는 호출되지 않아야 함
      expect(childHandler).toHaveBeenCalledTimes(0); // child도 호출되지 않아야 함
      expect(grandchildHandler).toHaveBeenCalledTimes(1); // grandchild만 호출되어야 함
    });
  });
```
`가장 최상위 요소`에서 `가장 아래인 요소` 까지 `이벤트`가 발생하는지 확인을 위해 위와 같은 `테스트 코드`를 작성하였고 `3가지 방식`으로 테스트를 진행하였습니다.

1. `방향` 상관없이 등록한 이벤트가 `정상적으로 작동`하니?
2. `중간요소`에 이벤트 발생시 `아래방향으로 이벤트가 발생`하니?
3. `가장 아래있는 애`가 이벤트 발생시 `자신만 이벤트`가 발생하니?

테스트 코드는 성공적으로 통과가 되었으며 아래까지 이벤트가 잘 작동하는 것을 확인할 수 있습니다.
<img width="327" alt="스크린샷 2025-04-03 오후 11 09 43" src="https://github.com/user-attachments/assets/8e037643-f771-4c0f-b32e-fc2cdaab525c" />


# (4) `fragment`처리

멘토링 시간에 코치님이 AI관련된 질문을 받았었는데 AI를 활용하여 `React의 fragment`에 대한 처리를 한번 해보면 재밌지 않겠냐 라고 말씀하셔서 한번 해볼까? 하고 진행을 해보았습니다.
![스크린샷 2025-04-03 오후 4 59 17](https://github.com/user-attachments/assets/432f9059-5ecd-4ec9-b936-432915976d77)
Fragment React 자료 : https://react.dev/reference/react/Fragment
실제로 React는 Fragment는 실제 DOM에 추가하지 않고 Fragment안에 있는 자식 요소들만 상위 요소에 직접 연결하는 방식을 사용한다고 합니다.(다른 방식으로 되는경우가 있는지 확인 필요)

여기서 저는 createVNode 생성시 Fragment타입을 선언해주고 createElement에서 그 안에 있는 값들만 연결시켜주면 되지 않을가? 라는 생각을 하였습니다.

JSX 구문(`<> <span>fragment</span> <p>문단</p> </>`)을 사용하려면 반드시 트랜스파일러(Babel 또는 TypeScript)가 필요하다고 하여 Babel설정을 해주는 방식(JSX)으로 구현을 진행
* Babel 설정 필요 (@babel/plugin-transform-react-jsx)

```javascript
  // createVNode.js  
  // Fragment (<>...</>)을 감지
  if (type === Fragment) {
    return children
      .flat(Infinity) //코치님 조언 -> flat(Infinity) 사용
      .filter(
        (child) => child !== false && child !== null && child !== undefined,
      );
  }


	
  // createElement.js
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
```
`document.createDocumentFragment()`을 통해 `fragment 생성`한뒤 `vNode 의 자식값`이 있는 경우 `재귀`를 통해 값을 처리해준뒤 `fragment`에 `append`하는 식으로 구현을 하였습니다.


```javascript
/** @jsxFrag Fragment */
import { createVNode, Fragment } from "../lib";

// 실사용
export const LoginPage = () => {
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
            항해플러스
          </h1>
          <form id="login-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              placeholder="사용자 이름"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full p-2 mb-6 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              로그인
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-blue-600 text-sm">
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <hr className="my-6" />
          <div className="text-center">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              새 계정 만들기
            </button>
          </div>
        </div>
      </div>
    </>
}
```
![스크린샷 2025-04-03 오후 5 08 36](https://github.com/user-attachments/assets/e589ec95-a115-45b8-93e9-b6cfef1c5537)
![스크린샷 2025-04-03 오후 5 08 54](https://github.com/user-attachments/assets/0f3e8f33-4ed6-403f-bfb5-06990b042589)

실제 `LoginPage`에 `React`처럼 `Fragment`를 집어 넣어봤으며 사진을 통해 알맞은 요소를 반환해 주는 것을 확인하실 수 있습니다.


## `fragment`에 대한 `테스트코드`
```javascript
    it("Fragment createVNode 생성", () => {
      const result = createVNode(
        Fragment,
        null,
        createVNode("span", null, "fragment"),
        createVNode("p", null, "문단"),
      );

      expect(result).toEqual([
        { type: "span", props: null, children: ["fragment"] },
        { type: "p", props: null, children: ["문단"] },
      ]);
    });
    
    it("fragment 구조를 처리해야 한다. createElement Babel이용", () => {
      const result = createElement(
        <>
          <span>fragment</span>
          <p>문단</p>
        </>,
      );
      expect(result instanceof DocumentFragment).toBe(true);
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("SPAN");
      expect(result.childNodes[0].textContent).toBe("fragment");
      expect(result.childNodes[1].tagName).toBe("P");
      expect(result.childNodes[1].textContent).toBe("문단");
    });
```
테스트 코드로 `createVNode`, `createElement Babel`이용 하는 방식으로 작성을 하였으며 
`Fragment`에 대한 처리를 해주는 것을 확인하실 수 있습니다.
<img width="361" alt="스크린샷 2025-04-03 오후 11 10 30" src="https://github.com/user-attachments/assets/270bdfdf-df12-4fcd-8157-b92a33aaeb03" />


## 리뷰 받고 싶은 내용

 - `React`는 `Fragment`는 실제 DOM에 추가하지 않고 `Fragment안에 있는 자식 요소들만 상위 요소`에 직접 연결하는 방식을 사용한다고 하는데 `다른 방법`으로 `Fragment`를 처리하는지 궁금합니다!

- 저는 개인적으로 `else` 사용하는 것을 안좋아하는데(`else`를 너무 많이 썼을때 가독성이 너무 안좋은 기억이..)
아래 처럼 분기처리 횟수가 적을때만 처리가 쉬웠지만, 더 많은 분기에서는 `else`를 사용하는 경우가 나올거같은데 `else사용 방법`에 대해서 궁금합니다
```javascript
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
```

- 이번 과제에서는 `에러 처리`에 대한 관리가 전혀 되어있지 않는데, `프론트엔드에서는 에러관리`를 보통 어떻게 진행하는게 좋을까요? 하나의 에러파일 또는 다수의 파일? `에러관리가 궁금합니다!`

> React는 Fragment는 실제 DOM에 추가하지 않고 Fragment안에 있는 자식 요소들만 상위 요소에 직접 연결하는 방식을 사용한다고 하는데 다른 방법으로 Fragment를 처리하는지 궁금합니다!

Fragment 처리를 위한 다른 방법들을 소개해볼게요!

1. DocumentFragment 방식 - 현재 사용하신 접근법입니다. 이는 웹 표준 API를 사용하는 가장 직관적인 방법입니다.

2. 배열 기반 처리 - 일부 가상 DOM 구현체는 Fragment를 단순히 자식 노드의 배열로 표현하고, 렌더링 시 이 배열의 각 요소를 부모 요소에 직접 추가합니다. 실제로 React 내부적으로는 이와 유사한 방식을 사용합니다.

3. Fiber 렌더러 최적화 - React의 Fiber 아키텍처에서는 Fragment가 결국 "효과 없는 노드"로 최적화되어, 실제 DOM 조작 단계에서 건너뛰게 됩니다.

좀 더 심화된 접근 방법으로는, Fragment를 "가상 마커"로 사용하여 복잡한 조건부 렌더링 상황에서 키(key) 관리를 더 효율적으로 할 수 있는 방법도 있습니다. 이는 특히 리스트 렌더링 최적화에 유용합니다.


> 분기처리 횟수가 적을때만 처리가 쉬웠지만, 더 많은 분기에서는 else를 사용하는 경우가 나올거같은데 else사용 방법에 대해서 궁금합니다

제일 많이 쓰이는 방법은 이렇게 객체로 매핑해서 쓰는 게 아닌가 싶어요 ㅎㅎ 제가 자주쓰는 방식이기도 합니다.

```javascript
const attributeHandlers = {
  className: (target, value) => target.setAttribute("class", value),
  event: (target, eventType, value) => addEvent(target, eventType, value),
  default: (target, attr, value) => target.setAttribute(attr, value)
};

function processAttribute(attr, value, target) {
  if (attr.startsWith("on")) {
    return attributeHandlers.event(target, attr.slice(2).toLowerCase(), value);
  }
  
  const handler = attributeHandlers[attr] || attributeHandlers.default;
  return handler(target, attr, value);
}
```

> 이번 과제에서는 에러 처리에 대한 관리가 전혀 되어있지 않는데, 프론트엔드에서는 에러관리를 보통 어떻게 진행하는게 좋을까요? 하나의 에러파일 또는 다수의 파일? 에러관리가 궁금합니다!

프론트엔드에서의 효과적인 에러 관리 전략은 이런 것들이 있어요.

1. 에러 경계(Error Boundaries): React의 에러 경계와 유사한 개념을 구현하여 컴포넌트 트리의 특정 부분에서 발생하는 오류가 전체 애플리케이션을 중단시키지 않도록 합니다.

2. 중앙화된 에러 처리: 에러 유형, 메시지, 심각도 등을 체계적으로 분류하고 처리하는 중앙 에러 핸들러를 만들면 좋습니다

```javascript
// errorHandler.js
export class AppError extends Error {
  constructor(code, message, severity = 'error') {
    super(message);
    this.code = code;
    this.severity = severity;
    this.timestamp = new Date();
  }
}

export const ErrorCodes = {
  NETWORK: 'ERR_NETWORK',
  VALIDATION: 'ERR_VALIDATION',
  RENDER: 'ERR_RENDER',
  // ...기타 에러 코드
};

export function handleError(error, context = {}) {
  // 에러 로깅
  console.error(`[${error.code || 'UNKNOWN'}]`, error.message, context);
  
  // 심각도에 따른 처리
  switch(error.severity) {
    case 'fatal':
      // 애플리케이션 복구 불가 처리
      break;
    case 'error':
      // 사용자에게 알림
      showErrorNotification(error);
      break;
    case 'warning':
      // 경고만 표시
      break;
    default:
      // 기본 처리
  }
  
  // 필요시 에러 리포팅 서비스로 전송
  reportErrorToService(error, context);
}
```

3. 에러 계층화: 도메인별 또는 기능별로 에러를 계층화하여 관리할 수 있습니다.
 - 네트워크 에러 (API 통신)
 - 렌더링 에러 (UI 컴포넌트)
 - 비즈니스 로직 에러 (상태 관리)
 - 사용자 입력 검증 에러

4. 비동기 에러 처리: Promise 체인과 async/await 구문에서의 에러 처리를 일관되게 관리합니다.

5. 전역 에러 캐치: `window.onerror` 및 `unhandledrejection` 이벤트를 활용하여 예상치 못한 에러를 포착합니다.


