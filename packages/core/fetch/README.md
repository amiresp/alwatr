# @alwatr/fetch

Enhanced fetch API with cache strategy, retry pattern, timeout, helper methods and enhanced types written in tiny TypeScript, ES module.

## Example usage

```ts
import {getJson} from 'https://esm.run/@alwatr/fetch';

interface ProductInterface {
  _id: string;
  name: string;
  description: string;
  image: string;
}

const productList = await getJson<Record<string, ProductInterface>>({
  url: '/api/products',
  queryParameters: {limit: 10},
  timeout: 5_000,
  retry: 3,
  cacheStrategy: 'stale_while_revalidate',
});
```

## Fetch Options

`FetchOptions` inherited from the [fetch standard parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters) and some other...

- `url`: Request URL.
- `bodyJson`: Body as JS Object.
- `queryParameters`: URL Query Parameters as JS Object.
- `timeout`: A timeout in ms for the fetch request (default `5000`ms).
- `retry`: If fetch response not acceptable or timed out, it will retry the request (default `3`).
- `cacheStorageName`: Cache storage name (default `alwatr_fetch_cache`).
- `cacheStrategy`: Strategies for caching, (default `network_only`).
  - `network_only`: Only network request without any cache.
  - `network_first`: Network first, falling back to cache.
  - `cache_only`: Cache only without any network request.
  - `cache_first`: Cache first, falling back to network.
  - `stale_while_revalidate`: Fastest strategy, Use cached first but always request network to update the cache.

[Read more about standard cache strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies)

## API

### `fetch(options: FetchOptions): Promise<Response>`

It's a wrapper around the browser's `fetch` function that adds retry pattern with timeout and cacheStrategy.

```ts
const response = await fetch({
  url: '/api/products',
  queryParameters: {limit: 10},
  timeout: 5_000,
  retry: 3,
  cacheStrategy: 'stale_while_revalidate',
});
```

### `getJson<T>(options: FetchOptions): Promise<T>`

It fetches a JSON file from a URL, and returns the parsed data.

```ts
const productList = await getJson<ProductResponse>({
  url: '/api/products',
  queryParameters: {limit: 10},
  timeout: 5_000,
  retry: 3,
  cacheStrategy: 'stale_while_revalidate',
});
```
