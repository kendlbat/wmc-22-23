const request = require('supertest');
const assert = require('assert');
const path = require('path');
const app = require('../../server.js');

const { setTestDataDir, unsetTestDataDir } = require('../common.js');

describe('backend-get-tours-filter', function () {

  beforeEach(() => setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'tenTours')));
  afterEach(unsetTestDataDir);

  let relURL = '/api/tours';

  it('get tours filter - with negative minNumPersons', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: -1 })
      .expect(400)
  });

  it('get tours filter - with non-numeric minNumPersons', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: 'first' })
      .expect(400)
  });

  it('get tours filter - with negative maxNumPersons', function () {
    return request(app)
      .get(relURL)
      .query({ maxNumPersons: -1 })
      .expect(400)
  });

  it('get tours filter - with non-numeric maxNumPersons', function () {
    return request(app)
      .get(relURL)
      .query({ maxNumPersons: 'ten' })
      .expect(400)
  });

  it('get tours filter - with minNumPersons > maxNumPersons ', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: 5, maxNumPersons: 4 })
      .expect(400)
  });

  it('get tours filter - minNumPersons=0', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: 0 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 10);
      })
  });

  it('get tours filter - minNumPersons=5', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: 5 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 3);
      })
  });

  it('get tours filter - maxNumPersons=5', function () {
    return request(app)
      .get(relURL)
      .query({ maxNumPersons: 5 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 8);
      })
  });

  it('get tours filter - minNumPersons=4 maxNumPersons=4', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: 4, maxNumPersons: 4 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 4);
      })
  });

  it('get tours filter - minNumPersons=2 maxNumPersons=6', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: 2, maxNumPersons: 6 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 8);
      })
  });

  it('get tours filter - minNumPersons=2 maxNumPersons=6 with paging', function () {
    return request(app)
      .get(relURL)
      .query({ minNumPersons: 2, maxNumPersons: 6, _limit: 2, _page: 2 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 2);
        assert.deepStrictEqual(
          response.body.map(t => t._id),
          ["081ece8d-a82a-496c-a952-66b22d4df0e0", "6149ca99-cad4-4c2b-885a-9893f7d44968"]);
      });
  })
});

