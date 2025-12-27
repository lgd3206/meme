import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background:
            'linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(236, 72, 153) 50%, rgb(59, 130, 246) 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>
          Explain This Meme
        </div>
        <div style={{ marginTop: 24, fontSize: 36, fontWeight: 600, opacity: 0.95 }}>
          AI Meme Explainer
        </div>
        <div style={{ marginTop: 44, fontSize: 26, opacity: 0.9 }}>
          explainthismeme.online
        </div>
      </div>
    ),
    size
  );
}

