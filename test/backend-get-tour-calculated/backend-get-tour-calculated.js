const request = require('supertest');
const assert = require('assert');
const path = require('path');
const app = require('../../server.js');

const { setTestDataDir, unsetTestDataDir } = require('../common');

describe('backend-get-tours-paging', function () {

  beforeEach(() => setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'fourTours')));
  afterEach(unsetTestDataDir);

  let relURL = '/api/tours';

  it('get tour - with non-existing id', function () {
    return request(app)
      .get(relURL + '/' + "6149ca99-aabb-4c2b-885a-9893f7d44968")
      .expect(404)
  });

  it('get tour - with existing id', function () {
    return request(app)
      .get(relURL + '/6149ca99-cad4-4c2b-885a-9893f7d44968')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body._id, '6149ca99-cad4-4c2b-885a-9893f7d44968');
        assert.equal(response.body.durationInMin, 38)
      })
  });

})

