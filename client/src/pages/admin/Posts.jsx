import React, { useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: "React Hooks Guide", author: "Bilal", status: "Published" },
    { id: 2, title: "Next.js vs React", author: "Admin", status: "Draft" },
  ]);

  const [newPost, setNewPost] = useState({
    title: "",
    author: "",
    status: "Draft",
  });

  const addPost = () => {
    if (!newPost.title || !newPost.author) return;
    setPosts([...posts, { id: Date.now(), ...newPost }]);
    setNewPost({ title: "", author: "", status: "Draft" });
  };

  const deletePost = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Posts</h2>

      {/* Add Post Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="border px-3 py-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Author"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          className="border px-3 py-2 mr-2 rounded"
        />
        <select
          value={newPost.status}
          onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
          className="border px-3 py-2 mr-2 rounded"
        >
          <option>Draft</option>
          <option>Published</option>
        </select>
        <button
          onClick={addPost}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Post
        </button>
      </div>

      {/* Posts Table */}
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="p-3">Title</th>
            <th className="p-3">Author</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{post.title}</td>
              <td className="p-3">{post.author}</td>
              <td className="p-3">{post.status}</td>
              <td className="p-3">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Posts;
