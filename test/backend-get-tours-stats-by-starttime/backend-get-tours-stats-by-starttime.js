const request = require('supertest');
const assert = require('assert');
const path = require('path');
const app = require('../../server.js');

const { setTestDataDir, unsetTestDataDir } = require('../common.js');

describe('backend-get-tours-stats-by-starttime', function () {

  beforeEach(() => setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'tenTours')));
  afterEach(unsetTestDataDir);

  const relURL = '/api/toursByStartTime';

  it('get tours by start time - without content check', function () {
    return request(app)
      .get(relURL)
      .expect(200)
  });


  it('get tours by start time - query not allowed', function () {
    return request(app)
      .get(relURL)
      .query({ _page: 'first' })
      .expect(400)
  });


  it('get tours by start time - stats result check', function () {
    return request(app)
      .get(relURL)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(Object.keys(response.body).length, 7);
        assert.deepStrictEqual(
          response.body,
          { "09:15": 1, "10:00": 1, "10:15": 3, "10:30": 2, "11:00": 1, "11:30": 1, "11:45": 1 });
      })
  });
});

