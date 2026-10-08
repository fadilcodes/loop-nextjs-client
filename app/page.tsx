'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          user_id: 'fadil_frontend_test' 
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply || 'Waduh, ada error nih.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Gagal terhubung ke server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="bg-orange-500 p-4 text-white">
          <h1 className="text-xl font-bold">Loopy Assistant</h1>
          <p className="text-sm opacity-80">Tanya apa saja tentang Loop</p>
        </div>

        {/* Area Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              Mulai obrolan dengan AI Loop Institute...
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3 ${
                  msg.role === 'user' ? 'bg-orange-400 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <div className="text-sm leading-relaxed space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>strong]:font-bold">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 rounded-xl rounded-bl-none p-3 animate-pulse">
                AI sedang mengetik...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            disabled={isLoading}
          />
         <button
  type="submit"
  disabled={isLoading || !input.trim()} 
  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 disabled:opacity-50 transition-colors cursor-not-allowed"
>
  Kirim
</button>
        </form>
      </div>
    </div>
  );
}