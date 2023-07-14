import { SearchParams } from "notion-types";
import pMemoize from "p-memoize";
import { api } from "./config";
import fetch from "isomorphic-unfetch";

export const searchNotion = pMemoize(searchNotionImp, {
  cacheKey: (args) => args[0]?.query,
});

async function searchNotionImp(params: SearchParams) {
  return fetch(api.searchNotion, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => {
      console.log(res);

      if (res.ok) return res;

      const error = new Error(res.statusText);

      return Promise.reject(error);
    })
    .then((res) => res.json());
}
