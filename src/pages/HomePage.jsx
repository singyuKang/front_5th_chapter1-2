/** @jsx createVNode */
import { createVNode } from "../lib";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";
import { userStorage } from "../storages";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, "로그인 후 이용해주세요"를 alert로 띄운다.
 */
export const HomePage = () => {
  const { posts } = globalStore.getState();
  const { loggedIn, currentUser } = globalStore.getState();

  function likeClickEvent(id) {
    const post = [...posts].find((post) => post.id === id);
    const userName = currentUser.username;
    if (!post || !userName) return;
    const userLiked = post.likeUsers.includes(userName);
    if (userLiked) {
      globalStore.setState({
        posts: posts.map((p) =>
          p.id === id
            ? {
                ...p,
                likeUsers: p.likeUsers.filter((user) => user !== userName),
              }
            : p,
        ),
      });
    }
    if (!userLiked) {
      globalStore.setState({
        posts: posts.map((p) =>
          p.id === id ? { ...p, likeUsers: [...p.likeUsers, userName] } : p,
        ),
      });
    }
  }

  function postClickEvent(id) {
    const textareaContent = document.getElementById("post-content").value;
    if (!textareaContent || !textareaContent.trim()) return;
    const newPost = {
      id: Date.now(), // 간단한 고유 ID 생성
      author: globalStore.getState().currentUser.username,
      time: Date.now(),
      content: textareaContent,
      likeUsers: [],
    };
    globalStore.setState({
      posts: [newPost, ...posts],
    });
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm postClickEvent={postClickEvent} />}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                const activationLike =
                  currentUser && props.likeUsers.includes(currentUser.username);
                return (
                  <Post
                    {...props}
                    activationLike={activationLike}
                    loggedIn={loggedIn}
                    likeClickEvent={likeClickEvent}
                  />
                );
              })}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
