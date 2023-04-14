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

  function Tag({ children }) {
    return (
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
          textTransform: 'uppercase',
          background: 'black',
          color: 'white',
          padding: '6px 12px',
        }}
      >
        {children}
      </span>
    );
  }

  return new ImageResponse(
    (
      <div
        lang='zh-CN'
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '-.02em',
          fontWeight: 700,
          background: 'white',
          fontFamily: 'Inter, "Material Icons"',
        }}
      >
        <div
          style={{
            left: 42,
            top: 42,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {pageInfo.authorImage && (
            <img
              src={pageInfo.authorImage}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
              }}
            />
          )}

          {pageInfo.author && (
            <p
              style={{
                fontSize: 24,
                letterSpacing: '0.1em',
                fontWeight: 700,
              }}
            >
              {pageInfo.author}
            </p>
          )}
        </div>
        {pageInfo.tags && (
          <div
            style={{
              right: 0,
              top: 56,
              position: 'absolute',
              display: 'flex',
              gap: '0.5em',
            }}
          >
            {pageInfo.tags.map((t) => (
              <Tag key={t}># {t}</Tag>
            ))}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '30px 50px',
            margin: '0',
            fontSize: 36,
            width: 'auto',
            maxWidth: 700,
            textAlign: 'center',
            backgroundColor: 'black',
            color: 'white',
            lineHeight: 1.4,
          }}
        >
          {pageInfo.title}
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
