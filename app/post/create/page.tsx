import CreatePostForm from "@/components/create-post-form";

//기존의 use cache삭제
// use cache는 페칭함수에만 사용
export default async function CreatePost() {
  return (
    <div className="p-3">
      <CreatePostForm />
    </div>
  );
}
