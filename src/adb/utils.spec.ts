import { expect } from 'chai'
import { isValidIp, isValidNetmask, fromRange, fromNetmask } from './utils'

// Testing isValidIp function
describe('Utils isValidIp tests', () => {
  // Testing valid ip
  it('Will ensure 192.168.1.2 is a valid ip', () => {
    const ip = '192.168.1.2'
    const actual = isValidIp(ip)
    expect(actual).to.be.equal(true)
  })

  // Testing not a valid ip
  it('Will ensure 258.168.1.2 is not a valid ip', () => {
    const ip = '258.168.1.2'
    const actual = isValidIp(ip)
    expect(actual).to.be.equal(false)
  })
})

describe('Utils isValidNetmask tests', () => {
  it('Will ensure 255.255.255.128 is a valid netmask', () => {
    const netmask = '255.255.255.128'
    const actual = isValidNetmask(netmask)
    expect(actual).to.be.equal(true)
  })

  it('Will ensure 255.255.255.144 is not a valid netmask', () => {
    const netmask = '255.255.255.144'
    const actual = isValidNetmask(netmask)
    expect(actual).to.be.equal(false)
  })
})

// Testing fromRange function
describe('Utils fromRange tests', () => {
  // Testing range for Octet D
  it('Will ensure range 192.168.1.2 - 192.168.1.5 can be parsed', () => {
    const actual = fromRange({
      from: '192.168.1.2',
      to: '192.168.1.5',
    })
    expect(actual).to.be.deep.equal([
      '192.168.1.2',
      '192.168.1.3',
      '192.168.1.4',
      '192.168.1.5',
    ])
  })

  // Testing range for Octet C
  it('Will ensure range 192.168.1.253 - 192.168.2.5 can be parsed', () => {
    const actual = fromRange({
      from: '192.168.1.253',
      to: '192.168.2.5',
    })

    expect(actual[0]).to.be.equal('192.168.1.253')
    expect(actual[2]).to.be.equal('192.168.1.255')
    expect(actual[3]).to.be.equal('192.168.2.0')
    expect(actual[4]).to.be.equal('192.168.2.1')
    expect(actual[8]).to.be.equal('192.168.2.5')
  })

  // Testing range for Octet B
  it('Will ensure range 192.168.255.253 - 192.169.0.5 can be parsed', () => {
    const actual = fromRange({
      from: '192.168.255.253',
      to: '192.169.0.5',
    })

    expect(actual[0]).to.be.equal('192.168.255.253')
    expect(actual[2]).to.be.equal('192.168.255.255')
    expect(actual[3]).to.be.equal('192.169.0.0')
    expect(actual[4]).to.be.equal('192.169.0.1')
    expect(actual[8]).to.be.equal('192.169.0.5')
  })

  // Testing range for Octet A
  it('Will ensure range 191.255.255.253 - 192.0.0.5 can be parsed', () => {
    const actual = fromRange({
      from: '191.255.255.253',
      to: '192.0.0.5',
    })

    expect(actual[0]).to.be.equal('191.255.255.253')
    expect(actual[2]).to.be.equal('191.255.255.255')
    expect(actual[3]).to.be.equal('192.0.0.0')
    expect(actual[4]).to.be.equal('192.0.0.1')
    expect(actual[8]).to.be.equal('192.0.0.5')
  })

  // Testing empty range
  it('Will ensure empty range cannot be parsed', () => {
    const actual = () =>
      fromRange({
        from: '',
        to: '',
      })
    expect(actual).to.throw('From  or to  is not a valid IP address')
  })

  // Testing incorrect range
  it('Will ensure range 192.168.1.3 - 192.168.1.2 cannot be parsed', () => {
    const actual = () =>
      fromRange({
        from: '192.168.1.3',
        to: '192.168.1.2',
      })
    expect(actual).to.throw('Incorrect range')
  })
})

describe('Utils fromNetMask tests', () => {
  it('Will ensure 192.168.1.16 - 255.255.255.252 have the correct netmask', () => {
    const actual = fromNetmask({ ip: '192.168.1.16', mask: '255.255.255.248' })
    expect(actual).to.be.deep.equal([
      '192.168.1.17',
      '192.168.1.18',
      '192.168.1.19',
      '192.168.1.20',
      '192.168.1.21',
      '192.168.1.22',
    ])
  })

  it('Will ensure 192.168.252.0 - 255.255.254.0 have the correct netmask', () => {
    const actual = fromNetmask({ ip: '192.168.252.0', mask: '255.255.254.0' })

    expect(actual[0]).to.be.equal('192.168.252.1')
    expect(actual[254]).to.be.equal('192.168.252.255')
    expect(actual[255]).to.be.equal('192.168.253.0')
    expect(actual[509]).to.be.equal('192.168.253.254')
  })

  it('Will ensure 192.252.0.0 - 255.252.0.0 have the correct netmask', () => {
    const actual = fromNetmask({ ip: '192.252.0.0', mask: '255.252.0.0' })

    expect(actual[0]).to.be.equal('192.252.0.1')
    expect(actual[131070]).to.be.equal('192.253.255.255')
    expect(actual[131071]).to.be.equal('192.254.0.0')
    expect(actual[262141]).to.be.equal('192.255.255.254')
  })

  it('Will ensure empty netmask cannot be parsed', () => {
    const actual = () => fromNetmask({ ip: '', mask: '' })
    expect(actual).to.throw(' is not a valid IP or  is not a valid netmask')
  })
})
