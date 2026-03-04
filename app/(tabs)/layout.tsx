import TabBar from "@/components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/*각 페이지의 본문이 그려질 자리 */}
      {children}

      {/*본문 아래 항상 붙어다닐 하단 바의 위치 */}
      <TabBar />
    </div>
  );
}
