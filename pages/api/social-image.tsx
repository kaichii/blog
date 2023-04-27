import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { api, apiHost, rootNotionPageId } from '@/lib/config';
import { NotionPageInfo } from '@/lib/types';

export const config = {
  runtime: 'edge',
};

export default async function OGImage(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get('id') || rootNotionPageId;
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 });
  }

  const pageInfoRes = await fetch(`${apiHost}${api.getNotionPageInfo}`, {
    method: 'POST',
    body: JSON.stringify({ pageId }),
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!pageInfoRes.ok) {
    return new Response(pageInfoRes.statusText, { status: pageInfoRes.status });
  }

  const pageInfo: NotionPageInfo = await pageInfoRes.json();
  console.log(pageInfo);

  function Circle({ color, size = 30 }) {
    return (
      <div
        style={{
          flex: `${size}px 0 0`,
          background: color,
          width: size,
          height: size,
          borderRadius: '50%',
        }}
      />
    );
  }

  return new ImageResponse(
    (
      <div
        lang='zh-CN'
        style={{
          display: 'flex',
          position: 'relative',
          height: '100%',
          width: '100%',
          backgroundColor: ' #74EBD5',
          backgroundImage: 'linear-gradient(24deg, #8c52ff 0%, #5ce1e6 100%)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 929,
            height: 500,
            background: 'white',
            borderRadius: 32,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderBottom: '4px solid #f1f1f1',
              padding: '18px 32px',
              alignItems: 'center',
              height: 'auto',
              columnGap: '12px',
              width: '100%',
            }}
          >
            <Circle color='#fe5e57' />
            <Circle color='#febc2e' />
            <Circle color='#29c740' />
            <div
              style={{
                display: 'flex',
                padding: '12px 64px 12px 24px',
                background: '#f1f1f1',
                borderRadius: 32,
                fontSize: 20,
                marginLeft: 18,
                color: '#08864e',
                maxWidth: 664,
                overflow: 'hidden',
                position: 'relative',
                height: 48,
                alignItems: 'center',
              }}
            >
              {pageInfo.url && (
                <p
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'clip',
                  }}
                >
                  {pageInfo.url}
                </p>
              )}
              <div
                style={{
                  position: 'absolute',
                  right: -4,
                  top: 12,
                  bottom: 12,
                  width: 64,
                  height: 24,
                  background: '#f1f1f1',
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 32,
            }}
          >
            {pageInfo.title && (
              <p style={{ fontSize: 48, textAlign: 'center' }}>
                {pageInfo.title}
              </p>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              columnGap: 24,
              marginBottom: 32,
              marginRight: 32,
            }}
          >
            {pageInfo.detail && (
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: '#939393',
                }}
              >
                {pageInfo.detail}
              </span>
            )}
            {pageInfo.authorImage && (
              <img width='68' height='68' src={pageInfo.authorImage} />
            )}
          </div>
        </div>
      </div>
    )
  );
}
