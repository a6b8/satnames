import { PatternFinder } from './pattern/PatternFinder.mjs'


export class SatNames {
    #config
    #state
    #patternFinder
    #debug


    constructor( debug=false ) {
        this.debug = debug
        
        this.#config = {
            'lastSat': BigInt( 2099999997690000 ),
            'charSet': 'abcdefghijklmnopqrstuvwxyz',
            'challenges': {
                'default': [
                    {
                        'name': 'default',
                        'logic': [
                            {
                                'value': null,
                                'method': 'regularExpression',
                                'expect': {
                                    'logic': '=',
                                    'value': true
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }


    init() {
        this.#debug ? console.log( 'SAT NAMES' ) : ''
        this.#state = {
            'current': {}
        }

        this.#patternFinder = new PatternFinder()
        return this
    }


    setDefaultPattern( { pattern=null } ) {
        this.#debug ? console.log( ' - Activate Default Challenges' ) : ''
        if( typeof( pattern ) !== 'string' ) {
            throw new Error( `  Variable pattern "${pattern}" is not type string` )
        }

        const defaultChallenges = JSON.parse( 
            JSON.stringify( this.#config['challenges']['default'] ) 
        )

        defaultChallenges[ 0 ]['logic'][ 0 ]['value'] = pattern
        this.#patternFinder.setChallenges( { 'challenges': defaultChallenges } )

        return true
    }


    setCustomPattern( { customChallenges  }) {
        this.#debug ? console.log( ' - Activate Custom Challenges' ) : ''
        this.#patternFinder.setChallenges( { 'challenges': customChallenges } )

        return true
    }


    toSatName( { satNumber, test } ) {
        if( typeof satNumber !== 'string' ) {
            throw new Error( `satNumber is not type of "string"` )
        } else {
            try {
                satNumber = BigInt( satNumber )
            } catch( e ) {
                throw new Error( `satNumber is not convertable to BigInt()` )
            }
        }

        let name = ''

        let x = this.#config['lastSat'] - satNumber
        while( x > 0 ) {
            const i = ( x - BigInt( 1 ) )
            const index = Number( i % BigInt( this.#config['charSet'].length ) )
            name += this.#config['charSet'][ index ]
                .toString()
            x = i / BigInt( this.#config['charSet'].length )
        }

        const satName = name
            .split( '' )
            .reverse()
            .join( '' )

        this.#state['current'] = { satNumber, satName }

        return satName
    }


    toSatNumber( { satName } ) {
        if( typeof satName !== 'string' ) {
            throw new Error( `satName is not type of "string"` )
        }

        const x = satName
            .split( '' )
            .reduce( ( acc, char, index ) => {
                const charOffset = BigInt( char.codePointAt( 0 ) - 'a'.codePointAt( 0 ) + 1 )
                acc = acc * BigInt( this.#config['charSet'].length ) + charOffset
                return acc
            }, BigInt( 0 ) )

        const satNumber = ( this.#config['lastSat'] - x )
            .toString()

        this.#state['current'] = { satNumber, satName }
        
        return satNumber
    }


    checkPatterns() {
        if( !Object.hasOwn( this.#state['current'], 'satName' ) ) {
            throw new Error( `Execute before .toSatName()` )
        }

        const result = {
            ...this.#state['current'],
            'patterns': this.#patternFinder.setPatterns( { 
                'str': this.#state['current']['satName'] 
            } )
        }

        return result
    }
}