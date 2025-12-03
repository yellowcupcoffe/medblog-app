import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import api from "../utils/api";

export default function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Start writing your blog...",
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  // Upload image inside editor
  const addImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");

const res = await api.post("/api/posts/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`
  }
});


    const url = res.data.url;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <label className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90">
          Upload Image
          <input type="file" className="hidden" onChange={addImage} />
        </label>
      </div>

      <div className="min-h-[300px] border border-gray-300 rounded-xl bg-white/70 backdrop-blur p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
