# @m7/mopidy

A strict, type-safe TypeScript client for the [Mopidy](https://mopidy.com/) JSON-RPC HTTP API.

Modelled 1:1 with the Mopidy Core API — no normalization, no field renaming, no frontend abstractions. Raw wire types are returned directly so consumers can transform data as needed.

---

## Installation

This is a private package in the monorepo. Import it via its package name:

```ts
import { createMopidy } from '@m7/mopidy';
```

---

## Quick start

```ts
import { createMopidy } from '@m7/mopidy';

const mopidy = createMopidy({ url: 'http://localhost:6680/mopidy/rpc' });

// Playback
await mopidy.playback.play();
await mopidy.playback.pause();
await mopidy.playback.seek(30_000); // milliseconds

// Current track
const track = await mopidy.playback.getCurrentTrack();
console.log(track?.name, track?.length);

// Tracklist (queue)
await mopidy.queue.add({ uris: ['spotify:track:abc123'] });
const tlTracks = await mopidy.queue.getTlTracks();

// Playlists
const playlists = await mopidy.playlists.list(); // returns Ref[]
const items = await mopidy.playlists.getItems(playlists[0].uri);

// History
const history = await mopidy.history.getHistory(); // [timestamp, Ref][]

// Library
const refs = await mopidy.library.browse('spotify:');
const results = await mopidy.library.search({ any: ['radiohead'] });
```

---

## API

### `createMopidy(options)`

Returns a `MopidyFacade` with a pre-wired client and all services.

```ts
interface CreateMopidyOptions {
  url: string;                      // Mopidy JSON-RPC endpoint
  fetch?: typeof globalThis.fetch;  // custom fetch (e.g. for Node.js)
  headers?: Record<string, string>; // extra HTTP headers
  idGenerator?: () => JsonRpcId;    // custom request ID generator
}
```

### `createMopidyClient(options)`

Returns a bare `MopidyClient` if you only need raw RPC calls:

```ts
const result = await client.call('core.playback.get_current_track');
```

All method names, params, and result types are fully inferred from `MopidyMethodMap`.

---

## Services

### `playback`

| Method | Mopidy method |
|--------|--------------|
| `play(tlid?)` | `core.playback.play` |
| `pause()` | `core.playback.pause` |
| `resume()` | `core.playback.resume` |
| `stop()` | `core.playback.stop` |
| `next()` | `core.playback.next` |
| `previous()` | `core.playback.previous` |
| `seek(timePosition)` | `core.playback.seek` |
| `getState()` | `core.playback.get_state` |
| `getCurrentTrack()` | `core.playback.get_current_track` |
| `getCurrentTlTrack()` | `core.playback.get_current_tl_track` |
| `getCurrentTlid()` | `core.playback.get_current_tlid` |
| `getTimePosition()` | `core.playback.get_time_position` |

### `queue` (tracklist)

| Method | Mopidy method |
|--------|--------------|
| `getTlTracks()` | `core.tracklist.get_tl_tracks` |
| `add({ uris, at_position? })` | `core.tracklist.add` |
| `remove(criteria)` | `core.tracklist.remove` |
| `clear()` | `core.tracklist.clear` |
| `shuffle(start?, end?)` | `core.tracklist.shuffle` |

### `playlists`

| Method | Mopidy method |
|--------|--------------|
| `list()` | `core.playlists.as_list` |
| `getItems(uri)` | `core.playlists.get_items` |

> `getItems` returns `Ref[] | null`, not `Track[]` — matching Mopidy's actual response shape.

### `history`

| Method | Mopidy method |
|--------|--------------|
| `getHistory()` | `core.history.get_history` |
| `getLength()` | `core.history.get_length` |

### `library`

| Method | Mopidy method |
|--------|--------------|
| `browse(uri?)` | `core.library.browse` |
| `search(query, uris?, exact?)` | `core.library.search` |

---

## Data models

All types mirror the [Mopidy data model](https://docs.mopidy.com/stable/api/models/) exactly — snake_case fields, nullable where Mopidy allows null.

```ts
import type {
  Ref, RefType,
  Track, Album, Artist,
  TlTrack, Playlist, Image,
  SearchResult, PlaybackState,
} from '@m7/mopidy';
```

Raw wire types (with `__model__?` discriminants) are also exported from `@m7/mopidy/rpc` if needed for lower-level work.

---

## Error handling

```ts
import { MopidyRpcError, MopidyTransportError } from '@m7/mopidy';

try {
  await mopidy.playback.play();
} catch (err) {
  if (err instanceof MopidyTransportError) {
    // network / HTTP failure
  }
  if (err instanceof MopidyRpcError) {
    console.log(err.code, err.method);
  }
}
```

| Class | When thrown |
|-------|------------|
| `MopidyTransportError` | Network failure or non-OK HTTP status |
| `MopidyRpcError` | Mopidy returned a JSON-RPC error response |
| `MopidyValidationError` | Invalid input (e.g. empty URI list) |
