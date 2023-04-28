const request = require('supertest');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const app = require('../../server.js');
const { setTestDataDir, unsetTestDataDir, removeJSONFiles } = require('../common');

const relURL = '/api/schools';

describe('backend-put-schools', function () {

  beforeEach(() => {
    setTestDataDir(__dirname, 'workingDir')
    removeJSONFiles(__dirname, path.join('workingDir', 'schools'));
  });

  afterEach(() => {
    unsetTestDataDir();
  });

  const schoolTemplate = {
    "id": 202417,
    "title": "HTL Villach",
    "address": {
      "zip-code": 9500,
      "city": "Villach",
      "street": "Tschinowitscherweg 5"
    },
    "type": "BHS"
  };

  it('put school - happy flow', function () {
    return sendAndExpectSuccess(schoolTemplate);
  });

  it('put school - invalid id', function () {
    const newSchool = structuredClone(schoolTemplate);
    newSchool.id = 123;
    return sendAndExpectBadRequest(newSchool);
  });

  it('put school - invalid title', function () {
    const newSchool = structuredClone(schoolTemplate);
    newSchool.title = 'AB';
    return sendAndExpectBadRequest(newSchool);
  });

  it('put school - optional address', function () {
    const newSchool = structuredClone(schoolTemplate);
    delete newSchool.address;
    return sendAndExpectSuccess(newSchool);
  });

  it('put school - missing zip-code in address', function () {
    const newSchool = structuredClone(schoolTemplate);
    delete newSchool.address["zip-code"];
    return sendAndExpectBadRequest(newSchool);
  });

  it('put school - missing city in address', function () {
    const newSchool = structuredClone(schoolTemplate);
    delete newSchool.address["city"];
    return sendAndExpectBadRequest(newSchool);
  });

  it('put school - missing type', function () {
    const newSchool = structuredClone(schoolTemplate);
    delete newSchool.type;
    return sendAndExpectBadRequest(newSchool);
  });

  it('put school - lower-case type', function () {
    const newSchool = structuredClone(schoolTemplate);
    newSchool.type = 'ahs';
    return sendAndExpectSuccess(newSchool);
  });

  it('put school - unknown type', function () {
    const newSchool = structuredClone(schoolTemplate);
    newSchool.type = 'xhs';
    return sendAndExpectBadRequest(newSchool);
  });  

  it('put school - update existing', function() {
    return sendAndExpectSuccess(schoolTemplate)
      .then(_ => {
        const updatedSchool = structuredClone(schoolTemplate);
        updatedSchool.title = 'HTBLuVA Villach';        
        return sendAndExpectSuccess(updatedSchool);
      });
  });
})

function sendAndExpectBadRequest(newSchool) {
  return request(app)
    .put(relURL + '/' + newSchool.id)
    .send(newSchool)
    .expect(400)
    .then(_response => {
      // server must not create file
      let fileName = path.join(__dirname, 'workingDir', 'schools', newSchool.id + '.json');
      assert.equal(fs.existsSync(fileName), false);
    })
}

function sendAndExpectSuccess(newSchool) {
  return request(app)
    .put(relURL + '/' + newSchool.id)
    .send(newSchool)
    .expect(204)
    .then(_response => {
      // server must create file
      let fileName = path.join(__dirname, 'workingDir', 'schools', newSchool.id + '.json');
      assert.equal(fs.existsSync(fileName), true);

      // file must be the same as the initial object
      let fileContent = JSON.parse(fs.readFileSync(fileName));
      assert.deepEqual(fileContent, newSchool);
    })
}
