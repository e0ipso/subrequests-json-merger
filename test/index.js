const Merger = require('../dist');

module.exports = {
  setUp(cb) {
    this.responses = [
      {
        headers: new Map([['lorem', 'ipsum'], ['Content-ID', '<bar>']]),
        body: 'Hello World!',
      },
      {
        headers: new Map([['dolor', 'sid'], ['oof', 'rab']]),
        body: 'Bye Planet...',
      },
    ];
    cb();
  },
  mergeResponsesTest(test) {
    test.expect();
    const merged = Merger.mergeResponses(this.responses);
    test.deepEqual(merged, {
      headers: new Map([
        ['Status', '207'],
        ['Content-Type', 'application/json; type="application/json"'],
      ]),
      body: '{"0":{"headers":{"dolor":"sid","oof":"rab"},"body":"Bye Planet..."},"bar":{"headers":{"lorem":"ipsum","Content-ID":"<bar>"},"body":"Hello World!"}}', // eslint-disable-line max-len
    });
    test.done();
  },
  serializeResponse(test) {
    test.expect();
    const serialized = Merger.serializeResponse(this.responses[0]);
    test.equal(serialized, '{"headers":{"lorem":"ipsum","Content-ID":"<bar>"},"body":"Hello World!"}');
    test.done();
  },
};
