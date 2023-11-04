export class PatternFinder {
    #config
    #challenges
    #patterns
    

    constructor() {
        this.#config = {
            'patterns': {
                'active': true,
                'splitter': '_',
                'challenges': [
                    {
                        'name': 'ZerosGreaterThen3',
                        'active': true,
                        'logic': [
                            {
                                'method': 'inSuccession',
                                'option': 'startsWith',
                                'value': '0',
                                'expect': {
                                    'logic': '>',
                                    'value': 3
                                }
                            }
                        ]
                    },
                    {
                        'name': 'ZeroFrontAndEnd',
                        'active': true,
                        'logic': [
                            {
                                'method': 'inSuccession',
                                'option': 'startsWith',
                                'value': '0',
                                'expect': {
                                    'logic': '>',
                                    'value': 2
                                }
                            }
                            ,{
                                'method': 'inSuccession',
                                'option': 'endsWith',
                                'value': '0',
                                'expect': {
                                    'logic': '=',
                                    'value': 2
                                }
                            }

                        ]
                    },
                    {
                        'name': 'ZeroFrontAndEnd4',
                        'active': true,
                        'logic': [
                            {
                                'method': 'inSuccession',
                                'option': 'startsWith',
                                'value': '0',
                                'expect': {
                                    'logic': '=',
                                    'value': 4
                                }
                            }
                            ,{
                                'method': 'inSuccession',
                                'option': 'endsWith',
                                'value': '0',
                                'expect': {
                                    'logic': '=',
                                    'value': 4
                                }
                            }

                        ]
                    },
                    {
                        'name': 'regularExpressionText',
                        'active': true,
                        'logic': [
                            {
                                'value': 'abcdef',
                                'method': 'regularExpression',
                                'expect': {
                                    'logic': '=',
                                    'value': true
                                }
                            },
                            {
                                'method': 'inSuccession',
                                'option': 'startsWith',
                                'value': '0',
                                'expect': {
                                    'logic': '=',
                                    'value': 2
                                }
                            }
                        ]
                    }
                ]
                /*
                ,'inSuccession': [
                    {
                        'option': 'startsWith',
                        'keyName': '0',
                        'value': '0',
                        'expect': {
                            'logic': '=',
                            'value': 4
                        },
                        'active': true
                    }
                    ,{
                        'option': 'endsWith',
                        'keyName': '0',
                        'value': '0',
                        'expect': {
                            'logic': '=',
                            'value': 4
                        },
                        'active': true
                    }
                 
                    ,{
                        'option': 'between',
                        'keyName': '0',
                        'value': '0',
                        'expect': {
                            'logic': '=',
                            'value': 4
                        },
                        'active': true
                    }
                    

                ],
                'regexs': [
                    {
                        'keyName': 'triple0',
                        'value': /a6b888/,
                        'expect': {
                            'logic': '=',
                            'value': true
                        },
                        'active': true
                    }
                ]
                */
            }
        }

    
    }


    #init() {
        this.#patterns = {
            'challenges': [],
            'patterns': []
        }

        this.#addPatternsTemplate()

        return true
    }


    setChallenges( { challenges } ) {
        const messages = this.#validateChallenges( { challenges } )

        if( messages.length !== 0 ) {
            messages
                .forEach( ( msg, index, all ) => {
                    if( index === 0 ) { 
                        console.log( `Following Error${all.length > 0 ? 's' : ''} occured:` ) 
                    }
                    console.log( `- ${msg}` )
                } )
            throw new Error( `` )
        }

        this.#challenges = challenges

        this.#init()
    }


    #validateChallenges( { challenges } ) {
        let messages = []
        messages = challenges
            .map( ( challenge, index ) => {
                return this.#validateChallenge( { challenge, index } )
            } )
            .flat( 1 )

        return messages
    }


    #validateChallenge( { challenge, index } ) {
        let messages = []

        if( typeof challenge !== 'object' || challenge === null ) {
            messages.push( `[${index}] challenge is not type object` )
        }
    
        if( typeof challenge['name'] !== 'string' || challenge['name'] === '' ) {
            messages.push( `[${index}] key "name" is not type "string" `)
        }
    
        if( !Array.isArray( challenge['logic'] ) ) {
            messages.push( `[${index}] key "logic" is not type "array"` )
        } else {
            challenge['logic']
                .forEach( ( logicItem, rindex ) => {
                    let msgs = this.#validateLogic( { logicItem, index, rindex } )
                    messages = [ ...messages, ...msgs ]
                } )
        }

        return messages
    }


    #validateLogic( { logicItem, index, rindex } ) {
        let messages = []

        let id = `[${index}] logic [${rindex}]`

        if (
            typeof logicItem !== 'object' ||
            logicItem === null ||
            !( 'value' in logicItem ) ||
            !( 'method' in logicItem ) ||
            // !( 'option' in logicItem ) ||
            !( 'expect' in logicItem )
        ) {
            messages.push( `${id} keys missing "value", "method", "expect".` )
        }
    
        if (typeof logicItem['value'] !== 'number' && typeof logicItem['value'] !== 'string') {
            messages.push( `${id} key value is not type string or number` )
        }
    
        if( logicItem['method'] !== 'regularExpression' && logicItem['method'] !== 'inSuccession' ) {
            messages.push( `${id} value of key "method" is not "regularExpression" or "inSuccession"` )
        }

        if( Object.hasOwn( logicItem, 'option') ) {
            if( logicItem['option'] !== 'startsWith' && logicItem['option'] !== 'endsWith' ) {
                messages.push( `${id} value of key "option" is not "startsWith" or "endsWith"` )
            }
        }
    
        if (
            typeof logicItem['expect'] !== 'object' ||
            !( 'logic' in logicItem['expect'] ) ||
            !( 'value' in logicItem['expect'] ) ||
            ( typeof logicItem['expect']['value'] !== 'boolean' && typeof logicItem['expect']['value'] !== 'number' )
        ) {
            messages.push( `${id} key "expect" is not type object` )
        }

        return messages
    }


    setPatterns( { str } ) {
        const cmds = this.#patterns['cmds']
            .reduce( ( acc, cmd, index ) => {
                const key = index + ''
                switch( cmd['method'] ) {
                    case 'inSuccession':
                        acc[ key ] = this.patternsInSuccession( { 
                            'str': str,
                            'option': cmd['option'], 
                            'value': cmd['value'],
                            'expect': cmd['expect']
                        } )

                        // results.push( acc[ key ]['success'] )
                        break
                    case 'regularExpression': 
                        const reg = new RegExp( cmd['value'] )

                        const test = str.match( reg )
                        acc[ key ] = {
                            'value': ( test !== null ),
                            'success': null
                        }

                        acc[ key ]['success'] = acc[ key ]['value'] === cmd['expect']['value']
                        // results.push( acc[ key ]['success'] )
                        break
                    default:
                        this.printMsg( { 
                            'type': 'error', 
                            'str': `Key "${cmd['method']}" not found` 
                        } )
                        break
                }

                return acc
            }, {} )

        const struct = this.#challenges
            .reduce( ( acc, a, index ) => {
                acc[ a['name'] ] = {
                    'success': false
                }

                acc[ a['name'] ]['success'] = a['patternIds']
                    .every( id => cmds[ `${id}` ]['success'] )

                return acc
            }, {} )

        const test = Object
            .entries( struct )
            .map( a => a[ 1 ]['success'] )
            .some( a => a )

        struct['found'] = { 
            'success': test
        }

        // process.exit( 1 )

        return struct
    }


    #addPatternsTemplate() {
        const patterns = this.#challenges
            // .filter( a => a['active'] )
            .reduce( ( acc, a, index ) => {
                a['logic']
                    .forEach( pattern => {
                        acc.push( pattern )
                    } )
                return acc
            }, [] )
            .map( a => {
                return Object
                    .keys( a )
                    .sort()
                    .reduce( ( abb, key ) => { 
                        abb[ key ] = a[ key ] 
                        return abb
                    }, {} )
            } )
            .map( a => JSON.stringify( a ) )
            .filter( ( v, i, a ) => a.indexOf( v ) === i )

        this.#challenges = this.#challenges
            // .filter( a => a['active'] )
            .reduce( ( acc, challenge, index ) => {
                const struct = {
                    'name': challenge['name'],
                    'patternIds': []
                }

                challenge['logic']
                    .forEach( a => {
                        let search = Object
                            .keys( a )
                            .sort()
                            .reduce( ( abb, key ) => { 
                                abb[ key ] = a[ key ] 
                                return abb
                            }, {} )
                        search = JSON.stringify( search )
                        const id = patterns
                            .findIndex( a => a === search )

                        struct['patternIds'].push( id )
                    } )

                acc.push( struct )
                return acc
            }, [] )

        this.#patterns['cmds'] = patterns
            .map( a => JSON.parse( a ) )


/*

        const cmds = [ 'inSuccession', 'regexs' ]
            .reduce( ( acc, method, index ) => {
                this.config['patterns'][ method ]
                    .filter( a => a['active'] )
                    .forEach( a => {
                        const cmd = { ...a }
                        cmd['method'] = method
                        const names = []
                        names.push( method )
                        a.hasOwnProperty( 'option' ) ? names.push( a['option'] ) : ''
                        names.push( a['keyName'] )
                        cmd['outputKey'] = names
                            .join( this.config['patterns']['splitter'] )

                        acc.push( cmd )
                    } )

                return acc
            }, [] )

        console.log( 'cmds', cmds )
        process.exit( 1 )
    */
        return true
    }
}