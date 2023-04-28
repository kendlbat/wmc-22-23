const request = require('supertest');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const app = require('../../server.js');
const { setTestDataDir, unsetTestDataDir, removeJSONFiles, copyJSONFiles } = require('../common');

describe('backend-delete-school', function () {

  beforeEach(() => {
    setTestDataDir(__dirname, 'workingDir')
    // removeJSONFiles(__dirname, path.join('workingDir', 'schools'));
  });

  afterEach(() => {
    unsetTestDataDir();
  });

  let relURL = '/api/schools';

  it('delete school - with zero schools', function () {
    return request(app)
      .delete(relURL + "/12345")
      .expect(404);
  });

  it('delete school - with non-existing school id', function () {
    copyJSONFiles(__dirname,
      path.join('..', 'commonDatasets', 'someSchools', 'schools'),
      path.join('workingDir', 'schools'));

    return request(app)
      .delete(relURL + "/12345")
      .expect(404);
  });

  it('delete school - with existing school id', function () {
    copyJSONFiles(__dirname,
      path.join('..', 'commonDatasets', 'someSchools', 'schools'),
      path.join('workingDir', 'schools'));

    const schoolId = '202026';
    return request(app)
      .delete(relURL + '/' + schoolId )
      .expect(204)
      .then(_response => {
        // file must be gone
        let fileName = path.join(__dirname, 'workingDir', 'schools', schoolId + '.json');
        assert.equal(fs.existsSync(fileName), false);
      })
  });
})

