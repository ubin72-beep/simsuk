"use client";

import { useState } from "react";

const faqs = [
  {
    q: "배송은 얼마나 걸리나요?",
    qEn: "How long does shipping take?",
    a: "주문 후 1–2 영업일 내 발송되며, 국내 배송은 2–3일 소요됩니다. 5만원 이상 무료 배송입니다.",
    aEn: "Orders ship within 1–2 business days. Domestic delivery takes 2–3 days. Free shipping on orders over ₩50,000.",
  },
  {
    q: "교환 및 환불이 가능한가요?",
    qEn: "Can I exchange or get a refund?",
    a: "수령 후 7일 이내 제품에 하자가 있는 경우 교환 또는 환불이 가능합니다. 단순 변심의 경우 미개봉 상태에서 환불 가능합니다.",
    aEn: "Exchanges and refunds are available within 7 days of receipt for defective products. Unopened returns are accepted for change of mind.",
  },
  {
    q: "헤마타이트는 어떻게 관리하나요?",
    qEn: "How do I care for hematite?",
    a: "헤마타이트는 물과 화학물질에 약하므로, 착용 후 부드러운 천으로 닦아 보관해 주세요. 샤워나 수영 시 제거해 주세요.",
    aEn: "Hematite is sensitive to water and chemicals. Wipe clean with a soft cloth after wearing and remove before showering or swimming.",
  },
  {
    q: "선물 포장 서비스가 있나요?",
    qEn: "Do you offer gift wrapping?",
    a: "네, 모든 제품에 선물 포장 서비스를 제공합니다. 주문 시 요청해 주세요.",
    aEn: "Yes, we offer gift wrapping for all products. Please request it when placing your order.",
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-stone-950 border-b border-stone-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-100 mb-6">
            문의하기
          </h1>
          <p className="text-stone-400 text-lg">
            궁금하신 점이 있으시면 언제든지 문의해 주세요.
          </p>
          <p className="text-stone-600 text-sm mt-2">
            We&apos;re here to help. Reach out anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-stone-100 mb-8">
              연락처 <span className="text-stone-500 text-lg font-normal ml-2">Contact Info</span>
            </h2>

            <div className="space-y-6 mb-12">
              {[
                {
                  icon: "✉️",
                  label: "이메일 Email",
                  value: "hello@simsuk.kr",
                },
                {
                  icon: "💬",
                  label: "카카오톡 KakaoTalk",
                  value: "@심석SIMSUK",
                },
                {
                  icon: "📸",
                  label: "인스타그램 Instagram",
                  value: "@simsuk_official",
                },
                {
                  icon: "🕐",
                  label: "운영시간 Hours",
                  value: "평일 10:00–18:00 (KST)",
                },
              ].map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="text-2xl w-10 flex-shrink-0">{info.icon}</div>
                  <div>
                    <p className="text-stone-500 text-xs tracking-wider mb-1">
                      {info.label}
                    </p>
                    <p className="text-stone-200 text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <h2 className="text-2xl font-bold text-stone-100 mb-6">
              자주 묻는 질문 <span className="text-stone-500 text-base font-normal ml-2">FAQ</span>
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-stone-800 hover:border-stone-700 transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-4 py-4 flex justify-between items-start gap-4"
                  >
                    <div>
                      <p className="text-stone-200 text-sm font-medium">{faq.q}</p>
                      <p className="text-stone-600 text-xs mt-0.5">{faq.qEn}</p>
                    </div>
                    <span className="text-amber-400 text-xl flex-shrink-0">
                      {openFaq === i ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 border-t border-stone-900">
                      <p className="text-stone-400 text-sm leading-relaxed mt-3">{faq.a}</p>
                      <p className="text-stone-600 text-xs leading-relaxed mt-2">{faq.aEn}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-stone-100 mb-8">
              메시지 보내기 <span className="text-stone-500 text-lg font-normal ml-2">Send a Message</span>
            </h2>

            {submitted ? (
              <div className="bg-stone-900 border border-amber-800 p-8 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-amber-400 font-bold text-lg mb-2">
                  메시지가 전송되었습니다!
                </h3>
                <p className="text-stone-400 text-sm mb-1">
                  빠른 시일 내에 답변 드리겠습니다.
                </p>
                <p className="text-stone-600 text-xs">
                  We&apos;ll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="mt-6 text-sm text-amber-400 hover:text-amber-300 border-b border-amber-800"
                >
                  새 문의하기 · New Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-stone-400 text-xs tracking-wider mb-2 uppercase">
                    이름 Name <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-700 placeholder-stone-700"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-xs tracking-wider mb-2 uppercase">
                    이메일 Email <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-700 placeholder-stone-700"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-xs tracking-wider mb-2 uppercase">
                    내용 Message <span className="text-amber-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-700 placeholder-stone-700 resize-none"
                    placeholder="문의 내용을 입력해 주세요..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-400 text-black font-bold py-4 hover:bg-amber-300 transition-colors tracking-widest text-sm uppercase"
                >
                  전송하기 · Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
