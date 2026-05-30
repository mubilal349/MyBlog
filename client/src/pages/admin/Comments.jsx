import React, { useState } from "react";

const Comments = () => {
  const [comments, setComments] = useState([
    { id: 1, text: "Great article!", author: "Ali" },
    { id: 2, text: "Thanks for sharing.", author: "Sara" },
  ]);

  const deleteComment = (id) =>
    setComments(comments.filter((c) => c.id !== id));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Comments</h2>
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="p-3">Comment</th>
            <th className="p-3">Author</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{c.text}</td>
              <td className="p-3">{c.author}</td>
              <td className="p-3">
                <button
                  onClick={() => deleteComment(c.id)}
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

export default Comments;
