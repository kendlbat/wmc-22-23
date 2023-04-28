const request = require('supertest');
const assert = require('assert');
const path = require('path');
const app = require('../../server.js');

const { setTestDataDir, unsetTestDataDir } = require('../common');

describe('backend-get-tours-paging', function () {

  beforeEach(() => setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'fourTours')));
  afterEach(unsetTestDataDir);

  let relURL = '/api/tours';

  it('get tours paging - with negative _page', function () {
    return request(app)
      .get(relURL)
      .query({ _page: -1 })
      .expect(400)
  });

  it('get tours paging - with non-numeric _page', function () {
    return request(app)
      .get(relURL)
      .query({ _page: 'first' })
      .expect(400)
  });

  it('get tours paging - with negative _limit', function () {
    return request(app)
      .get(relURL)
      .query({ _limit: -1 })
      .expect(400)
  });

  it('get tours paging - with non-numeric _limit', function () {
    return request(app)
      .get(relURL)
      .query({ _limit: 'ten' })
      .expect(400)
  });

  it('get tours paging - with only the _limit argument', function () {
    return request(app)
      .get(relURL)
      .query({ _limit: 20 })
      .expect(400)
  });

  it('get tours paging - with only the _page argument', function () {
    return request(app)
      .get(relURL)
      .query({ _page: 20 })
      .expect(400)
  });

  it('get tours paging - first two items', function () {
    return request(app)
      .get(relURL)
      .query({ _limit: 2, _page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 2);
        assert.deepStrictEqual(
          response.body.map(t => t._id),
          ["6149ca99-cad4-4c2b-885a-9893f7d44968", "8fb7e095-dfec-40fd-9ca2-30f51950de17"]);
      })
  });

  it('get tours paging - second two items', function () {
    return request(app)
      .get(relURL)
      .query({ _limit: 2, _page: 2 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 2);
        assert.deepStrictEqual(
          response.body.map(t => t._id),
          ["e7827a5b-b1a3-46d4-ae00-646565caad0a", "08c7b5b6-e3c9-4875-b75c-c12b592bdecc"]);
      })
  });

  it('get tours paging - third two items (empty)', function () {
    return request(app)
      .get(relURL)
      .query({ _limit: 2, _page: 3 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 0);
      })
  });

  it('get tours paging - item 4', function () {
    return request(app)
      .get(relURL)
      .query({ _limit: 3, _page: 2 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 1);
        assert.deepStrictEqual(
          response.body.map(t => t._id),
          ["08c7b5b6-e3c9-4875-b75c-c12b592bdecc"]);
      })
  });

})

