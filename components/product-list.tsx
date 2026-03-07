"use client";

import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-product";
import { getMoreProducts } from "@/app/(tabs)/products/action";
import { InitialProducts } from "@/app/(tabs)/products/page";

interface ProductListProps {
  initialProducts: InitialProducts; //getInitialProducts의 리턴값 타입을 그대로 가져와서 선언함 (타입 동기화)
}

//상품들의 전체목록 상태관리 + infinite Scrolling 로직
//page.tsx에서 보낸 props을 받음
export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts); //product data의 state
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    //observe의 지침정의
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current); //감시 중단, 중복요청 방지
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setProducts((prev) => [...prev, ...newProducts]); //새 상품을 기존의 상품과 함친 배열을 생성
            setPage((prev) => prev + 1); //newProduct의 길이가 0이 아니면, 새page추가
          } else {
            setIsLastPage(true); //list.lenth가 0일 경우 lastpage = true
          }
          setIsLoading(false);
        }
      },
      { threshold: 1, rootMargin: "0px 0px -100px 0px" },
    );
    //실행코드
    if (trigger.current) {
      observer.observe(trigger.current); // entries[0], observe 시작
    }
    return () => {
      observer.disconnect(); // observe 중단, 클린업,
    };
  }, [page]); //page(매개변수)가 변경되면 코드가 재실행됨
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger} // current 요소
          className=" text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "더보기"}
        </span>
      ) : (
        "No more items"
      )}
    </div>
  );
}
