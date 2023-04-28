const request = require('supertest');
const assert = require('assert');
const path = require('path');
const app = require('../../server.js');

const { setTestDataDir, unsetTestDataDir } = require('../common');

describe('backend-get-schools', function () {

  // unset data dir for scenario
  afterEach(unsetTestDataDir);

  let relURL = '/api/schools';

  it('get schools - with zero schools', function () {
    setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'zeroSchools'));

    return request(app)
      .get(relURL)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 0);
      })
  });

  it('get schools - with four schools', function () {
    setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'someSchools'));

    return request(app)
      .get(relURL)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.length, 4);
      })
  });

  it('get school - with non-existing id', function () {
    setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'someSchools'));

    return request(app)
      .get(relURL + '/1234')
      .expect(404)
  });

  it('get school - with existing id', function () {
    setTestDataDir(__dirname, path.join('..', 'commonDatasets', 'someSchools'));

    return request(app)
      .get(relURL + '/202026')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert.equal(response.body.id, 202026);
        assert.equal(response.body.type, "AHS")
      })
  });

})

