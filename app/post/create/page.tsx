import CreatePostForm from "@/components/create-post-form";
import { cacheLife, cacheTag } from "next/cache";

export default async function CreatePost() {
  "use cache";
  cacheLife("seconds");
  cacheTag("posts");
  return (
    <div className="p-3 ">
      <CreatePostForm />
    </div>
  );
}
