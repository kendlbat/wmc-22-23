const request = require('supertest');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const app = require('../../server.js');
const { setTestDataDir, unsetTestDataDir, removeJSONFiles, copyJSONFiles } = require('../common');

describe('backend-delete-tours', function () {

  beforeEach(() => {
    setTestDataDir(__dirname, 'workingDir')
    removeJSONFiles(__dirname, path.join('workingDir', 'tours'));
  });

  afterEach(() => {
    unsetTestDataDir();
  });

  let relURL = '/api/tours';

  it('delete tours - with zero tours', function () {
    return request(app)
      .delete(relURL + "/12345")
      .expect(404);
  });

  it('delete tours - with non-existing tour id', function () {
    copyJSONFiles(__dirname,
      path.join('..', 'commonDatasets', 'fourTours', 'tours'),
      path.join('workingDir', 'tours'));

    return request(app)
      .delete(relURL + "/12345")
      .expect(404);
  });

  it('delete tours - with existing tour id', function () {
    copyJSONFiles(__dirname,
      path.join('..', 'commonDatasets', 'fourTours', 'tours'),
      path.join('workingDir', 'tours'));

    const tourUUID = '8fb7e095-dfec-40fd-9ca2-30f51950de17';
    return request(app)
      .delete(relURL + '/' + tourUUID )
      .expect(204)
      .then(_response => {
        // file must be gone
        let fileName = path.join(__dirname, 'workingDir', 'tours', tourUUID + '.json');
        assert.equal(fs.existsSync(fileName), false);
      })
  });
})

