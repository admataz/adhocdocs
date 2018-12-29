const request = require('request')
const expect = require('chai').expect
const semver = require('semver')
const { server: config } = require('../server/config')

const baseUrl = `http://localhost:${config.port}`

describe('http server', () => {
  it('server should be running at configured port ', done => {
    request.get(baseUrl, (err, response, body) => {
      if (err) throw (err)
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  it('should return status code 404 when an endpoint does not exist', done => {
    request.get(`${baseUrl}/non-existent-url-3874238746`, (err, response, body) => {
      if (err) throw (err)
      expect(response.statusCode).to.equal(404)
      done()
    })
  })

  it('api health endpoint should respond with "ok"', done => {
    request.get(`${baseUrl}/api/health`, (err, response, body) => {
      if (err) throw (err)
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  it('api/v1 should respond with valid semver version', done => {
    request.get(`${baseUrl}/api/v1`, (err, response, body) => {
      if (err) throw (err)
      // eslint-disable-next-line no-unused-expressions
      expect(semver.satisfies(JSON.parse(body).version, 'v1.x')).to.be.true
      done()
    })
  })
})
