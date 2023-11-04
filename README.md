![CircleCI](https://img.shields.io/circleci/build/github/a6b8/ordinals-sat-names-finder-for-nodejs/main)

# Ordinals Sat Names Finder for node.js

This module allows you to derive the satellite name from ordinal satellite numbers. Additionally, it provides the ability to search for specific patterns in UTXOs within a given range.

## Table of Contents

- [Ordinals Sat Names Finder for node.js](#ordinals-sat-names-finder-for-nodejs)
  - [Table of Contents](#table-of-contents)
  - [Quickstart](#quickstart)
  - [.toSatName( {...} )](#tosatname--)
  - [.toSatNumber( {...} )](#tosatnumber--)
  - [.setSimplePattern( {...} )](#setsimplepattern--)
  - [.setCustomPattern( { 'challenges': \[ {...} \] )](#setcustompattern--challenges----)
    - [Overview](#overview)
    - [Example](#example)
  - [.getPatternsForSatRange( {...} )](#getpatternsforsatrange--)
  - [Contributing](#contributing)
  - [Limitations](#limitations)
  - [Credits](#credits)
  - [License](#license)
  - [Code of Conduct](#code-of-conduct)

## Quickstart

node
```bash
npm init -y
npm i satnames
```

index.mjs

```js
import { SatNames } from 'satnames'

const satNames = new SatNames()
satNames.init()
const number = '1953186218210490'
const satName = satNames
    .toSatName( { 'satNumber': number } )
    .getSatName()

console.log( `Check out the sleepiest sat: ${satName}`)
```

## .toSatName( {...} )

| Option       | Description                                             | Type   | Required |
|--------------|---------------------------------------------------------|--------|----------|
| satNumber    | The satellite number for which you want to get the name | string | true     |

Examples:

```js
satNames
    .toSatName( { 'satNumber': '123' } )
    .getSatName()
```

```js
import { SatNames } from 'satnames'

const satNames = new SatNames()
const result = satNames
    .init()
    .toSatName( { 'satNumber': '1953186218210490' } )
    .getSatName()

console.log( 'result', result )
```


## .toSatNumber( {...} )

| Option   | Description                                       | Type   | Required |
|----------|---------------------------------------------------|--------|----------|
| satName  | The satellite name for which you want to get the number | string | true     |

Examples:

```js
satNames
    .toSatNumber( { 'satNumber': '123' } )
    .getSatNUmber()
```

```js
import { SatNames } from 'satnames'

const satNames = new SatNames()
const result = satNames
    .init()
    .toSatNumber( { 'satName': 'zzzzzzzzzz' } )
    .getSatNumber()

console.log( 'result', result )
```


## .setSimplePattern( {...} )

| Option   | Description                                        | Type   | Required |
|----------|----------------------------------------------------|--------|----------|
| pattern  | The pattern or regular expression to search for   | string | true     |

With the .setSimplePattern( { 'pattern': 'abc' } ) method, you can easily perform searches. Since the search is performed using a regular expression, you can also input regex patterns like /abc/.

The following example checks whether the "sleepiest" ordinal has been found.

```js
import { SatNames } from 'satnames'

const satNames = new SatNames()
satNames
    .init()
    .setSimplePattern( { 'pattern': 'zzzzzzzzzz' } )

const result = satNames
    .toSatName( { 'satNumber': '1953186218210490' } )
    .getPatternsForSatName()

console.log( 'result', result )
```


## .setCustomPattern( { 'challenges': [ {...} ] )

### Overview

**Methods**
The following pattern methods are available:

| Method              | Description                                      | Options                     |
|---------------------|--------------------------------------------------|-----------------------------|
| `inSuccession`| Search for patterns in succession | `{ 'startsWith' }, { 'endsWith' }` |
| `regularExpression` | Search using regular expressions |no options needed |


**Logic**
Under `expect`, you need to specify a logic, and the following cases are available for this purpose. Use `value` to set the value against which the result is checked.

| Case     | Description                            |
|----------|----------------------------------------|
| `=`      | Check if `zeros` is equal to `value`  |
| `>`      | Check if `zeros` is greater than `value` |
| `>=`     | Check if `zeros` is greater than or equal to `value` |
| `<`      | Check if `zeros` is less than `value`  |
| `<=`     | Check if `zeros` is less than or equal to `value` |
| Default  | Display an error message if the logic is not recognized |


### Example

You can add as many challenges as you like using `.setCustomPattern( { 'challenges': [ {...} ] }`. For this purpose, there are the methods `inSuccession` with the options `startsWith` and `endsWith`, or `regularExpression`, where no option is needed.

In the following example, a search is performed for names that start with more than 2 'a's at the beginning and end with 2 'a's. The second search looks for names that contain the letter sequence "abcdef" within them.


```js
import { SatNames } from 'satnames'

const satNames = new SatNames()
satNames
    .init()
    .setCustomPattern( { 
        'challenges': [
            {
                'name': 'more a',
                'logic': [
                    {
                        'method': 'inSuccession',
                        'option': 'startsWith',
                        'value': 'a',
                        'expect': {
                            'logic': '>',
                            'value': 2
                        }
                    }
                    ,{
                        'method': 'inSuccession',
                        'option': 'endsWith',
                        'value': 'a',
                        'expect': {
                            'logic': '=',
                            'value': 2
                        }
                    }

                ]
            },
            {
                'name': 'myRegex',
                'logic': [
                    {
                        'method': 'regularExpression',
                        'value': 'abcdef',
                        'expect': {
                            'logic': '=',
                            'value': true
                        }
                    }
                ]
            }
        ] 
    } )

satNames
    .toSatName( { 'satNumber': '1953186218210490' } )
    .getPatternsForSatName()

console.log( 'result', result )
```


## .getPatternsForSatRange( {...} )

| Option  | Description                                              | Type   | Required |
|---------|----------------------------------------------------------|--------|----------|
| from    | The starting satellite number                            | string | true     |
| to      | The ending satellite number                              | string | true     |


```js
satNames
    .init()
    .setSimplePattern( { 'pattern': 'zzzzzzzzzz' } )
    .getPatternsForSatRange( { 'from': '123', 'to': '134' } )
```

```js
import { SatNames } from 'satnames'

const satNames = new SatNames()
satNames
    .init()
    .setSimplePattern( { 'pattern': 'zzzzzzzzzz' } )

const results = satNames
    .checkPatternsForSatRange( { 'from': 10, 'to': 130 } )

console.log( 'results', results )
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/a6b8/ordinals-sat-names-finder-for-nodejs. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/a6b8/ordinals-sat-names-finder-for-nodejs/blob/main/CODE_OF_CONDUCT.md).

## Limitations

- Currently in Alpha Stage

## Credits

- Inspired by Erin´s sleepiest tweet: https://twitter.com/realizingerin/status/1720485880631324936
- Bob Bodily, PhD tweet: https://twitter.com/BobBodily/status/1720496786513784947

## License

The module is available as open source under the terms of the [MIT](https://github.com/a6b8/ordinals-sat-names-finder-for-nodejs/blob/main/LICENSE).

## Code of Conduct

Everyone interacting in the EasyMina project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/a6b8/ordinals-sat-names-finder-for-nodejs/blob/main/CODE_OF_CONDUCT.md).


