import { NextApiRequest, NextApiResponse } from 'next';

import * as types from '../../lib/types';
import { search } from '../../lib/notion';
import { getPageProperty } from 'notion-utils';
import remove from 'lodash.remove';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' });
  }

  const searchParams: types.SearchParams = req.body;

  const results = await search(searchParams);

  results.results.forEach(item => {

    const block = results.recordMap?.block?.[item.id]?.value;

    const publishedTime = getPageProperty<number>('Published', block, results.recordMap as types.ExtendedRecordMap);

    if (!publishedTime) remove(results.results, (result) => result.id === item.id);
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  );
  res.status(200).json(results);
};
