const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Billing System API Tests', () => {
  let server;

  before((done) => {
    server = app.listen(3001, () => {
      console.log('Server started for testing');
      done();
    });
  });

  after((done) => {
    server.close(() => {
      console.log('Server closed after testing');
      done();
    });
  });

  describe('User Operations', () => {
    it('should create a user account', (done) => {
      chai.request(app)
        .post('/api/users')
        .send({ username: 'TestUser' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('username', 'TestUser');
          done();
        });

    it('should handle missing username when creating an account', (done) => {
        chai.request(app)
            .post('/api/users')
            .send({}) 
            .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Username is required');
            done();
            });
        });
    });

  });

  it('should fetch all products and services', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  
  
  describe('Admin Operations', () => {
    it('should fetch all orders for admin', (done) => {
      chai.request(app)
        .get('/api/admin/orders')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  
  });
  
});
