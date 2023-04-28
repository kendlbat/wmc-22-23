const request = require('supertest');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const app = require('../../server.js');
const { setTestDataDir, unsetTestDataDir, removeJSONFiles } = require('../common');

describe('backend-post-tours', function () {

  beforeEach(() => setTestDataDir(__dirname, 'emptyDir'));
  afterEach(() => {
    removeJSONFiles(__dirname, path.join('emptyDir', 'tours'));
    unsetTestDataDir();
  });

  let relURL = '/api/tours';

  it('post tours - with zero tours', function () {

    const newTour = {
      guideName: "John Doe",
      guideClass: "3AHIF",
      startTime: "14:30",
      endTime: "15:45",
      numPersons: 3,
      registration: true
    };

    return request(app)
      .post(relURL)
      .send(newTour)
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        // response must contain id
        const tourUUID = response.body?._id;        
        assert.notEqual(tourUUID, undefined);

        // server must create file
        let fileName = path.join(__dirname, 'emptyDir', 'tours', tourUUID + '.json');        
        assert.equal(fs.existsSync(fileName), true);

        // file must be the same as the response
        let fileContent = JSON.parse(fs.readFileSync(fileName));
        assert.deepEqual(fileContent, response.body);

        // response must be the initial object without the id
        delete response.body._id;
        assert.deepEqual(response.body, newTour);    
      })
  });
})

