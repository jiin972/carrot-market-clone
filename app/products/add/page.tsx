"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { useActionState, useState } from "react";
import { uploadProduct } from "./action";

export default function AddProducts() {
  //선택 이미지 미리보기 구현
  const [state, dispatch] = useActionState(uploadProduct, null);
  const [preview, setPreview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event; //event.target.files 구조분해 할당
    if (!files) return; //files가 null일 경우, 종료
    const file = files[0]; //선택한 첫 파일 가져오기(파일정보)
    //코드 챌린지 1. 가져온 file에서 타입검사
    if (!file.type.includes("image/")) {
      return alert("이미지만 업로드 가능합니다.");
    }
    //코드 챌린지 2. 가져온 file에서 용량검사
    if (file.size > 4 * 1024 * 1024) {
      return alert("4MB이하의 파일만 업로드 가능합니다.");
    }
    const url = URL.createObjectURL(file); //URL생성, file을 화면에 보여줌, 브라우저와 파일공유
    setPreview(url);
  };
  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className={`border-2 border-neutral-300 border-dashed aspect-square flex flex-col justify-center items-center
             text-neutral-300 hover:cursor-pointer hover:text-neutral-500 rounded-md bg-center bg-cover`}
          style={{
            backgroundImage: `url(${preview})`, //preview이미지
          }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm ">
                사진을 추가해 주세요.
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        {state?.fieldErrors.photo && (
          <span className="text-orange-500 font-medium px-1">
            {state.fieldErrors.photo[0]}
          </span>
        )}
        <Input
          name="title"
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors?.title}
          defaultValue={state?.payload.title?.toString() ?? ""}
        />
        <Input
          name="price"
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors?.price}
          defaultValue={state?.payload?.price?.toString() ?? ""}
        />
        <Input
          name="description"
          placeholder="자세한 설명"
          type="text"
          defaultValue={state?.payload.description?.toString() ?? ""}
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
