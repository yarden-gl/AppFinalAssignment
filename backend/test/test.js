const app = require ('../server.js');
const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect
chai.use(chaiHttp)

describe("Testing session forbidding", () => {
	it("should return 403 because lack of session", async () => {
            let res = await chai
                .request(app)
                .get('/api/cart')
            expect(res.status).to.equal(403);
        })
})

describe("Testing register user and login", () => {
	it("should return status 201 when registering a new user", async () => {
    	let res = await chai
        	.request(app)
        	.post('/register')
        	.send({ username: 'testuser', password: 'smith', remember: true })
    	expect(res.status).to.equal(201)
    })
    it("should return status 200 when logging in", async () => {
    	let res = await chai
        	.request(app)
        	.post('/signin')
        	.send({ username: 'testuser', password: 'smith', remember: true })
        expect(res.status).to.equal(200)
        expect(res).to.have.cookie('connect.sid');
    })
})

describe("Testing wrong user credentials and existing register", () => {
	it("should return status 404 when wrong credentials are entered", async () => {
    	let res = await chai
        	.request(app)
        	.post('/login')
        	.send({ username: 'testuser', password: 'wrong', remember: true })
    	expect(res.status).to.equal(404)
    })

    it("should return status 409 when existing user tries to register", async () => {
    	let res = await chai
        	.request(app)
        	.post('/register')
        	.send({ username: 'testuser', password: 'smith', remember: true })
    	expect(res.status).to.equal(409)
    })
})

describe("Deleting user for next cycle", () => {
	it("should return 200 after deleting testuser", async () => {
            let res = await chai
                .request(app)
                .delete('/deleteuser')
            expect(res.status).to.equal(200);
        })
})