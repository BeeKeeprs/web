"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export default function PilotForm() {
  const [opened, setOpened] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields = ["성함", "연락처", "농장 지역", "재배 작물", "수정벌 사용 현황", "참여 문의"].map((key) => `${key}: ${data.get(key) || "미입력"}`).join("\n");
    const subject = encodeURIComponent("[아워비] 100일 실증농가 참여 문의");
    const body = encodeURIComponent(`아워비 100일 실증농가 참여 문의\n\n${fields}`);
    window.location.href = `mailto:da.young.yun13@gmail.com?subject=${subject}&body=${body}`;
    setOpened(true);
  }
  return <form className="pilot-form" onSubmit={submit}><h3>참여 문의 남기기</h3><p>아래 내용을 적으면 이메일 앱에서 문의 내용을 보낼 수 있습니다.</p><div className="pilot-form-row"><label>성함<input name="성함" required placeholder="성함" /></label><label>연락처<input name="연락처" required placeholder="전화번호 또는 이메일" /></label></div><div className="pilot-form-row"><label>농장 지역<input name="농장 지역" required placeholder="예: 경남 밀양" /></label><label>재배 작물<input name="재배 작물" required placeholder="예: 딸기" /></label></div><label>수정벌 사용 현황<input name="수정벌 사용 현황" required placeholder="예: 사용 중인 벌통 수량" /></label><label>참여 문의<textarea name="참여 문의" rows={3} placeholder="설치 환경이나 궁금한 점을 적어주세요" /></label><button type="submit">이메일 앱에서 참여 문의하기 <ArrowRight size={18} /></button><small>{opened ? "이메일 앱에서 보내기를 눌러야 접수가 완료됩니다." : "버튼을 누르면 이메일 앱이 열립니다. 보내기를 눌러야 접수됩니다."}</small></form>;
}
