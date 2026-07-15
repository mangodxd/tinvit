'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Send, Loader2 } from 'lucide-react';

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      }
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 flex flex-col items-center">
        <h2 className="text-heading font-bold text-dark font-heading">Tin nhắn đã được gửi</h2>
        <p className="text-meta mt-2">Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-caption font-medium text-dark mb-1 font-body">
            Họ tên <span className="text-primary">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-4 py-2.5 border border-gray-300 text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-caption font-medium text-dark mb-1 font-body">
            Email <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-4 py-2.5 border border-gray-300 text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-caption font-medium text-dark mb-1 font-body">
          Chủ đề <span className="text-primary">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleChange}
          disabled={submitting}
          className="w-full px-4 py-2.5 border border-gray-300 text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-caption font-medium text-dark mb-1 font-body">
          Nội dung <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          disabled={submitting}
          className="w-full px-4 py-2.5 border border-gray-300 text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body resize-y disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-primary text-caption rounded">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-body cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Gửi tin nhắn
          </>
        )}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-accent py-3">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Liên hệ' },
            ]}
          />
        </div>
      </section>

      <section className="bg-page py-6 lg:py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
              <h1 className="text-display font-bold text-dark font-heading mb-2">Liên hệ</h1>
              <p className="text-body text-meta mb-8 font-body">
                Nếu bạn có thắc mắc hoặc góp ý, vui lòng gửi tin nhắn cho chúng tôi.
              </p>
              <ContactForm />

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-caption text-meta font-body">
                <span>contact@docbao.dev</span>
                <span>Việt Nam</span>
                <span>+84 123 456 789</span>
              </div>
          </div>
        </div>
      </section>
    </>
  );
}
