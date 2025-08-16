'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';

type ContentType = 'url' | 'text' | 'tel' | 'email' | 'vcard';

function buildVCard(payload: {
  name?: string;
  org?: string;
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  url?: string;
}) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    payload.name ? `FN:${payload.name}` : '',
    payload.org ? `ORG:${payload.org}` : '',
    payload.title ? `TITLE:${payload.title}` : '',
    payload.phone ? `TEL;TYPE=CELL:${payload.phone}` : '',
    payload.email ? `EMAIL;TYPE=INTERNET:${payload.email}` : '',
    payload.address ? `ADR;TYPE=HOME:;;${payload.address}` : '',
    payload.url ? `URL:${payload.url}` : '',
    'END:VCARD',
  ];
  return lines.filter(Boolean).join('\n');
}

export default function QRGeneratorPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [type, setType] = useState<ContentType>('url');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [size, setSize] = useState<number>(300);
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errLevel, setErrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const buildPayload = useCallback(() => {
    switch (type) {
      case 'url':
      case 'text':
        return value;
      case 'tel':
        return value.startsWith('tel:') ? value : `tel:${value}`;
      case 'email':
        return value.startsWith('mailto:') ? value : `mailto:${value}`;
      case 'vcard':
        return buildVCard({
          name,
          org,
          title,
          phone,
          email,
          address,
          url: value,
        });
      default:
        return value;
    }
  }, [type, value, name, org, title, phone, email, address]);

  useEffect(() => {
    const payload = buildPayload();
    if (!payload) {
      setDataUrl('');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(
      canvas,
      payload,
      {
        errorCorrectionLevel: errLevel,
        margin: 1,
        width: size,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      async (err) => {
        if (err) {
          console.error(err);
          setDataUrl('');
          return;
        }

        if (logoFile) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.src = URL.createObjectURL(logoFile);
            await new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            });
            const logoSize = Math.floor(size * 0.18);
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            ctx.save();
            ctx.fillStyle = bgColor;
            const r = 8;
            roundRect(ctx, x - 6, y - 6, logoSize + 12, logoSize + 12, r);
            ctx.fill();
            ctx.drawImage(img, x, y, logoSize, logoSize);
            ctx.restore();
            URL.revokeObjectURL(img.src);
          }
        }

        setDataUrl(canvas.toDataURL('image/png'));
      }
    );

    function roundRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  }, [type, value, name, org, title, phone, email, address, size, fgColor, bgColor, errLevel, logoFile, buildPayload]);

  const onDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
  };

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setLogoFile(f);
    else setLogoFile(null);
  };

  return (
    <main className="container">
      <div className={`grid grid-cols-1 lg:grid-cols-1 ${darkMode ? 'dark-theme' : 'light-theme'}`}></div>
        <div className="lg:col-span-1">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* 表单 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium">类型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="border rounded px-3 py-2"
              >
                <option value="url">URL</option>
                <option value="text">文本</option>
                <option value="tel">电话</option>
                <option value="email">邮箱</option>
                <option value="vcard">联系人 (vCard)</option>
              </select>
            </div>

            {type === 'vcard' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="border rounded px-3 py-2" placeholder="全名" value={name} onChange={(e) => setName(e.target.value)} />
                  <input name='company' className="border rounded px-3 py-2" placeholder="公司" value={org} onChange={(e) => setOrg(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input name='job' className="border rounded px-3 py-2" placeholder="职称" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input name='tel' className="border rounded px-3 py-2" placeholder="电话" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input name='email' className="border rounded px-3 py-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input name='address' className="border rounded px-3 py-2" placeholder="地址" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <input name='url' className="border rounded px-3 py-2" placeholder="网站/URL" value={value} onChange={(e) => setValue(e.target.value)} />
              </>
            ) : type === 'tel' ? (
              <input name="tel" className="border rounded px-3 py-2 w-full" placeholder="请输入电话号码" value={value} onChange={(e) => setValue(e.target.value)} />
            ) : type === 'email' ? (
              <input name="email" className="border rounded px-3 py-2 w-full" placeholder="请输入邮箱地址" value={value} onChange={(e) => setValue(e.target.value)} />
            ) : (
              <textarea name="content" className="border rounded px-3 py-2 min-h-[120px] w-full" placeholder="请输入内容" value={value} onChange={(e) => setValue(e.target.value)} />
            )}

            {/* 尺寸 + 滑块 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">尺寸 (px)</label>
                <input
                  type="number"
                  min={64}
                  max={500}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="range"
                  min={64}
                  max={500}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">容错等级</label>
                <select
                  value={errLevel}
                  onChange={(e) => setErrLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Logo</label>
                <input type="file" accept="image/*" onChange={onLogoChange} className="w-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-sm mb-1">前景色</label>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 p-0 border rounded" />
              </div>
              <div>
                <label className="block text-sm mb-1">背景色</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-0 border rounded" />
              </div>
              <div>
                <button onClick={() => { setValue(''); setName(''); setOrg(''); setTitle(''); setPhone(''); setEmail(''); setAddress(''); setLogoFile(null); }} className="btn btn-secondary w-full">
                  重置
                </button>
              </div>
              <div>
                <button onClick={onDownload} className="btn btn-primary w-full">
                  下载 PNG
                </button>
              </div>
            </div>
          </div>

          {/* 预览 */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="mb-3">预览</div>
            <div
              className={`p-4 rounded shadow max-w-full overflow-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              style={{ maxHeight: '600px' }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '600px',
                  maxHeight: '600px',
                  display: dataUrl ? 'block' : 'none',
                }}
              />
              {!dataUrl && (
                <div className="w-[300px] h-[300px] flex items-center justify-center text-gray-400">
                  请输入内容以生成二维码
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}