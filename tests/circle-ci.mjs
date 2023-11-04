import { SatNames } from './../src/SatNames.mjs'

const tests = [
    {
        'satNumber': '1953186218210490',
        'expect': 'zzzzzzzzzz'
    },
    {
        'satName': 'zzzzzzzzzz',
        'expect': '1953186218210490'
    },
    {
        'satNumber': '1020387494533427',
        'expect': 'gpuwbdtmfbi'
    },
    {
        'satName': 'gpuwbdtmfbi',
        'expect': '1020387494533427'
    }
]


const satNames = new SatNames()
satNames.init()

const results = tests
    .map( test => {
        let r = null
        if( Object.hasOwn( test, 'satNumber' ) )  {
            r = satNames.toSatName( { 'satNumber': test['satNumber'] } )
        } else {
            r = satNames.toSatNumber( { 'satName': test['satName'] } )
        }
        return r === test['expect']
    } )
    .every( a => a )

if( results ) {
    console.log( `All Test was successful!` )
    process.exit( 1 )
} else {
    console.log( 'Tests failed.' )
    process.exit( 0 )
}