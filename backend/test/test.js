import ('../backend/server.js');
import expect from 'chai';
// const expect = require('chai').expect;
// const request = require('request');
import request from 'request';
const baseRoute = "http://localhost:5000";

describe('User register and sign up', function () {
  it('should get 201 for new created user', function (done) {
    request.post(baseRoute + '/login ', function (err, res) {
      expect(res.status).to.equal(404);
    });
    done();
  })

  it('should receive 0 user connections when before start', function (done) {
    request.get('http://localhost:8080/calc/users-number', function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("0");
      done();
    });
  });
});

describe('Testing full basic flow', function () {
  let uniqueUser = "";
  it('should create a unique user and get the string', function (done) {
    request.get('http://localhost:8080/start', function (err, res, body) {
      expect(res.status).to.equal(200);
      uniqueUser = body;
      done();
    });
  });

  it('should add 10 to the unique user', function (done) {
    let postUrl = 'http://localhost:8080/calc/' + uniqueUser + '/add/10';
    request.post(postUrl, function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("10");
      done();
    });
  });

  it('should subtract 1 from the unique user string', function (done) {
    let postUrl = 'http://localhost:8080/calc/' + uniqueUser + '/sub/1';
    request.post(postUrl, function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("9");
      done();
    });
  });

  it('should divide by 3 the unique user value', function (done) {
    let putUrl = 'http://localhost:8080/calc/' + uniqueUser + '/divide/3';
    request.put(putUrl, function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("3");
      done();
    });
  });

  it('should multiply by 10 the unique user value', function (done) {
    let putUrl = 'http://localhost:8080/calc/' + uniqueUser + '/multiply/10';
    request.put(putUrl, function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("30");
      done();
    });
  });

  it('should return the current value: 30', function (done) {
    let getUrl = 'http://localhost:8080/calc/' + uniqueUser + '/M';
    request.get(getUrl, function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("30");
      done();
    });
  });

  it('should reset the user value to 0', function (done) {
    let postUrl = 'http://localhost:8080/calc/' + uniqueUser + '/reset';
    request.post(postUrl, function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("0");
      done();
    });
  });

  it('should delete the user from the map', function (done) {
    let delUrl = 'http://localhost:8080/calc/' + uniqueUser + '/del';
    request.delete(delUrl, function (err, res) {
      expect(res.status).to.equal(200);
      done();
    });
  });

})

describe('Testing addition of 5 users', function () {

  it('should add 5 new unique users', function (done) {
    let usersToAdd = 5;
    let uniqueUser;
    while (usersToAdd > 0) {
      request.get('http://localhost:8080/start', function (err, res, body) {
        uniqueUser = body;
        usersMap.set(uniqueUser, 0);
        expect(res.status).to.equal(200);
      });
      usersToAdd--;
    }
    done();
  });

  it('should receive 5 user connections', function (done) {
    request.get('http://localhost:8080/calc/users-number', function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("5");
      done();
    });
  });

  it('should delete 5 users from the user connections', function (done) {
      usersMap.forEach(function(value, key, map){
        let delUrl = 'http://localhost:8080/calc/' + key + '/del';
        request.delete(delUrl, function (err, res) {
          expect(res.status).to.equal(200);
        });
      })
    done();
  });

  it('should receive 0 user connections after deleting', function (done) {
    request.get('http://localhost:8080/calc/users-number', function (err, res, body) {
      expect(res.status).to.equal(200);
      expect(body).to.equal("0");
      done();
    });
  });
});