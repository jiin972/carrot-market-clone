//Date 형식 지정(string으로 리턴)
export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24; //하루동안의 milliSecond을 구함(기준)
  const time = new Date(date).getTime(); //DB에서 가져온 날짜를 ms(숫자)로 변경
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs); //지금과 DB에 등록된 날짜간의 차이를 구함
  //JavaScript의 국제화관련 API(번역기) Intl을 통해 한국어변환
  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}

//가격 표기법 변경(string으로 리턴)
export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}
