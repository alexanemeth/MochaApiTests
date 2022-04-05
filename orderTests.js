const { expect } = require("chai");
const token = require("./token");
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);
let url = "https://simple-books-api.glitch.me";
let authKey = "Authorization";
let authValue = "token";

describe("Orders tests", function () {
  //GET non-fiction-books
  it("It should get all non-fiction books", function (done) {
    chai
      .request(url)
      .get("/books?type=non-fiction")
      .send()
      .end(function (err, res) {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eq(2);
        done();
      });
  });

  //GET book by id
  it("It should get a book by id", function (done) {
    const id = 5;
    chai
      .request(url)
      .get("/books/" + id)
      .send()
      .end(function (err, res) {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("id").eq(5);
        res.body.should.have.property("name");
        res.body.should.have.property("author");
        done();
      });
  });

  //POST
  it("It should submit an order", function (done) {
    const order = {
      bookId: 4,
      customerName: "John",
    };
    chai
      .request(url)
      .post("/orders")
      .set(authKey, authValue)
      .send(order)
      .end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property("created");
        res.body.should.have.property("created").eq(true);
        res.body.should.have.property("orderId");
        done();
      });
  });

  //PATCH
  it("It should update an order's property", function (done) {
    const orderId = "l9o9-xCjTMZsBSxK-4sok";
    const update = {
      customerName: "Katy Veum",
    };
    chai
      .request(url)
      .patch("/orders/" + orderId)
      .set(authKey, authValue)
      .send(update)
      .end(function (err, res) {
        expect(err).to.be.null;
        res.should.have.status(204);

        chai
          .request(url)
          .get("/orders" + orderId)
          .send()
          .end(function (error, response) {
            expect(err).to.be.null;
            response.should.have.status(200);

            response.body.should.be.a("object");
            response.body.should.have.property("customerName").eq("Katy Veum");
            console.log(response.body);
            done();
          });
      });
  });

  //DELETE
  it("It should delete an order", function (done) {
    const orderId = "YKGRev2_S0FosyQqRsaSb";
    chai
      .request(url)
      .delete("/orders/" + orderId)
      .set(authKey, authValue)
      .send()
      .end(function (err, res) {
        res.should.have.status(204);
        done();
      });
  });
});
