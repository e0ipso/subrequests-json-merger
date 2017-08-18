# Subrequests JSON Merger

[![Coverage Status](https://coveralls.io/repos/github/e0ipso/subrequests-json-merger/badge.svg)](https://coveralls.io/github/e0ipso/subrequests-json-merger)
[![Known Vulnerabilities](https://snyk.io/test/github/e0ipso/subrequests-json-merger/badge.svg)](https://snyk.io/test/github/e0ipso/subrequests-json-merger)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/e0ipso/subrequests-json-merger.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/e0ipso/subrequests-json-merger.svg?branch=master)](https://travis-ci.org/e0ipso/subrequests-json-merger)

This module allow you to alter the format of the single response you get from
Subrequests. Instead of merging the sub-responses into a `multipart/related`
HTTP response, using this module we can merge them into a JSON object.

This JSON object will be keyed by request ID (possible expanded because of
JSONPath queries). Each top-level value is an object itself. Such objects
contain the `headers` and the `body` of the response.

## Usage
Inject the merger into subrequests when making a request.

```js
const JsonReponse = require('subrequests-json-merger');

subrequests.request(
  blueprint,
  new HttpRequestor(),
  JsonReponse // Make Subrequests produce a JSON document with all the responses.
)
.then(singleResponse => doYourStuff(singleResponse));
```

Using the example in the Subrequests module you will get the following output:

```json
{
  "req1": {
    "headers": {
      "content-length": "23",
      "…": "…",
      "x-subrequest-id": "req1",
      "Content-ID": "<req1>"
    },
    "body": "{\n  \"my-key\": \"lorem\"\n}"
  },
  "req2": {
    "headers": {
      "x-frame-options": "deny",
      "…": "…",
      "x-subrequest-id": "req2",
      "Content-ID": "<req2>"
    },
    "body": "{\n  \"runs\": {\n  \"in\": \"parallel\"\n  }\n}"
  },
  "req1.1#uri{0}": {
    "headers": {
      "x-frame-options": "deny",
      "…": "…",
      "x-subrequest-id": "req1.1#uri{0}",
      "Content-ID": "<req1.1#uri{0}>"
    },
    "body": "{\n  \"akward\": [\"moar\", \"hip\", \"tests\"]\n}"
  },
  "req1.1.1#uri{0}": {
    "headers": {
      "connection": "close",
      "x-cache": "HIT",
      "source-age": "179",
      "…": "…",
      "x-subrequest-id": "req1.1.1#uri{0}",
      "Content-ID": "<req1.1.1#uri{0}>"
    },
    "body": "[\n  {\n  \"ha\": \"li\"\n  }\n]"
  },
  "req1.1.1#uri{1}": {
    "headers": {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "max-age=300",
      "…": "…",
      "x-subrequest-id": "req1.1.1#uri{1}",
      "Content-ID": "<req1.1.1#uri{1}>"
    },
    "body": "true"
  },
  "req1.1.1#uri{2}": {
    "headers": {
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'",
      "…": "…",
      "x-subrequest-id": "req1.1.1#uri{2}",
      "Content-ID": "<req1.1.1#uri{2}>"
    },
    "body": "{\n  \"we need\": \"nonsensical strings\"\n}"
  }
}
```
