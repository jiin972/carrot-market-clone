import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    taint: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  cacheComponents: true, //"use cache" 사용을 위해 설정을 켬
  reactCompiler: true,
  images: {
    unoptimized: true, //로컬/외부 이미지 최적화 서버를 우회해 서빙, 리눅스환경문제,배포시 활성화
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com", // 해당 주소의 이미지만 최적화 진행
      },
    ],
  },
};

export default nextConfig;
