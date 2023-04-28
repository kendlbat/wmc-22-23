const request = require('supertest');
const assert = require('assert');
const path = require('path');
const app = require('../../server.js');

const { setTestDataDir, unsetTestDataDir } = require('../common');

describe('backend-get-tours', function () {

  // unset data dir for scenario
  afterEach(unsetTestDataDir);

  let relURL = '/api/tours';

  it('get tours - with zero tours', function () {
    setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'zeroTours'));

    return request(app)
      .get(relURL)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 0);
      })
  });

  it('get tours - with exactly one tour', function () {
    setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'oneTour'));

    return request(app)
      .get(relURL)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 1);
        assert.equal(response.body[0]._id, "6149ca99-cad4-4c2b-885a-9893f7d44968");
      })
  });

  it('get tours - with exactly five tours', function () {
    // TODO: this is just for demo how a test-specific dataset would look like
    setTestDataDir(__dirname, path.join('fiveTours'));

    return request(app)
      .get(relURL)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 5);
        assert.deepStrictEqual(
          response.body.map(t => t._id),
          ["6149ca99-cad4-4c2b-885a-9893f7d44968", "8fb7e095-dfec-40fd-9ca2-30f51950de17",
            "e7827a5b-b1a3-46d4-ae00-646565caad0a", "08c7b5b6-e3c9-4875-b75c-c12b592bdecc",
            "e7827a5b-b1a3-46d4-ae00-646565caadef"]);
      })
  });
})

