import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true, //로컬/외부 이미지 최적화 서버를 우회해 서빙, 리눅스환경문제,배포시 활성화
  },
};

export default nextConfig;
