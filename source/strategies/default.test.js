/* eslint-disable max-len *//* eslint-disable max-statements */
// eslint-disable-next-line max-params
(function main(assert, Uri_query) {
    describe('Uri_query default strategy', describe_default_strategy);
    return true;

    // -----------

    function describe_default_strategy() {
        it('separates pairs on "&"', test_for_separator);
        it('ignores empty pairs', test_for_empty_pairs);
        it('interprets omitted "=" as true, e.g. ?all', test_for_true);
        it('interprets omitted value as null, e.g. ?q=', test_for_null);
        it('interprets occurrences of "=" relatively sanely', test_for_equals);
        it('decodes keys and values', test_for_decoding);
        it('parses/composes flat arrays', test_for_flat_array);
        it('parses/composes multidimensional arrays', test_for_nonflat_array);
        it('parses/composes sets', test_for_set);
        it('parses/composes flat objects', test_for_flat_object);
        it('parses/composes non-flat objects', test_for_mixed_object);
        it('composes inherited values', test_for_inherited_values);
    }

    function test_for_separator() {
        const uri_query = new Uri_query('?one=fish&2=fish&red=fish&%230000FF=fish');
        assert.strictEqual(uri_query.one, 'fish');
        assert.strictEqual(uri_query['2'], 'fish');
        assert.strictEqual(uri_query.red, 'fish');
        assert.strictEqual(uri_query['#0000FF'], 'fish');
        assert.strictEqual(`${ uri_query }`, '?%230000FF=fish&2=fish&one=fish&red=fish');
    }

    function test_for_empty_pairs() {
        const uri_query = new Uri_query('?&&&foo=bar&&&bar=baz&&&');
        assert.strictEqual(uri_query.foo, 'bar');
        assert.strictEqual(uri_query.bar, 'baz');
        assert.strictEqual(`${ uri_query }`, '?bar=baz&foo=bar');
    }

    function test_for_true() {
        const uri_query = new Uri_query('?yes');
        assert.strictEqual(uri_query.yes, true);
        assert.strictEqual(`${ uri_query }`, '?yes');
    }

    function test_for_null() {
        const uri_query = new Uri_query('?nil=');
        assert.strictEqual(uri_query.nil, null);
        assert.strictEqual(`${ uri_query }`, '?nil=');
    }

    // eslint-disable-next-line max-statements
    function test_for_equals() {
        let uri_query = new Uri_query('?bar===&bone=8==8');
        assert.strictEqual(uri_query.bar, '==');
        assert.strictEqual(uri_query.bone, '8==8');
        assert.strictEqual(`${ uri_query }`, '?bar=%3D%3D&bone=8%3D%3D8');

        uri_query = new Uri_query('?=');
        assert.strictEqual(uri_query['='], true, '?=');
        assert.strictEqual(`${ uri_query }`, '?%3D');

        uri_query = new Uri_query('?%3D');
        assert.strictEqual(uri_query['='], true, '?%3D');
        assert.strictEqual(`${ uri_query }`, '?%3D');

        uri_query = new Uri_query('?==');
        assert.strictEqual(uri_query['='], null, '?==');
        assert.strictEqual(`${ uri_query }`, '?%3D=');

        uri_query = new Uri_query('?%3D=&%3D%3D');
        assert.strictEqual(uri_query['='], null, '?%3D=');
        assert.strictEqual(uri_query['=='], true, '?%3D%3D');
        assert.strictEqual(`${ uri_query }`, '?%3D=&%3D%3D');

        uri_query = new Uri_query('?===');
        assert.strictEqual(uri_query['='], '=', '?===');
        assert.strictEqual(`${ uri_query }`, '?%3D=%3D');

        uri_query = new Uri_query('?=%3D');
        assert.strictEqual(uri_query['=='], true, '?=%3D');
        assert.strictEqual(`${ uri_query }`, '?%3D%3D');
    }

    function test_for_decoding() {
        const uri_queries = [
            new Uri_query('%24=1%2C000%2C000&title=%22Laser%22&purpose=Punch+a%20hole+in+the+%22Ozone%20Layer%22'),
            new Uri_query('$=1,000,000&title="Laser"&purpose=Punch a hole in the "Ozone Layer"'),
            new Uri_query({
                '%24': '1%2C000%2C000',
                title: '%22Laser%22',
                purpose: 'Punch+a%20hole+in+the+%22Ozone%20Layer%22',
                }), // eslint-disable-line indent
            new Uri_query({
                $: '1,000,000',
                title: '"Laser"',
                purpose: 'Punch a hole in the "Ozone Layer"',
                }), // eslint-disable-line indent
            ]; // eslint-disable-line indent
        for (const uri_query of uri_queries) {
            assert.strictEqual(uri_query.$, '1,000,000');
            assert.strictEqual(uri_query.title, '"Laser"');
            assert.strictEqual(uri_query.purpose, 'Punch a hole in the "Ozone Layer"');
            assert.strictEqual(
                `${ uri_query }`,
                '?%24=1%2C000%2C000&purpose=Punch%20a%20hole%20in%20the%20%22Ozone%20Layer%22&title=%22Laser%22',
                ); // eslint-disable-line indent
        }
    }

    function test_for_flat_array() {
        let uri_query = new Uri_query('?fish[1]=two&fish[0]=one');
        assert(Array.isArray(uri_query.fish), 'fish an array? (1)');
        assert.strictEqual(uri_query.fish[0], 'one');
        assert.strictEqual(uri_query.fish[1], 'two');
        assert.strictEqual(`${ uri_query }`, '?fish[0]=one&fish[1]=two');

        uri_query = new Uri_query({ fish: [ '1', 2, 'red', 'blue' ] });
        assert(Array.isArray(uri_query.fish), 'fish an array? (2)');
        assert.strictEqual(uri_query.fish[0], '1');
        assert.strictEqual(uri_query.fish[1], 2);
        assert.strictEqual(uri_query.fish[2], 'red');
        assert.strictEqual(uri_query.fish[3], 'blue');
        assert.strictEqual(`${ uri_query }`, '?fish[0]=1&fish[1]=2&fish[2]=red&fish[3]=blue');
    }

    function test_for_nonflat_array() {
        const uri_queries = [
            new Uri_query('?tictactoe[0][0]=X&tictactoe[0][1]=O&tictactoe[0][2]=X&tictactoe[1][0]=O&tictactoe[1][1]=X&tictactoe[1][2]=O&tictactoe[2][0]=X&tictactoe[2][1]=O&tictactoe[2][2]=X'),
            new Uri_query({ tictactoe: [
                [ 'X', 'O', 'X' ],
                [ 'O', 'X', 'O' ],
                [ 'X', 'O', 'X' ],
                ]}), // eslint-disable-line
            ]; // eslint-disable-line indent
        for (const uri_query of uri_queries) {
            assert(Array.isArray(uri_query.tictactoe), 'tictactoe an array?');
            assert(Array.isArray(uri_query.tictactoe[0]), 'tictactoe[0] an array?');
            assert(Array.isArray(uri_query.tictactoe[1]), 'tictactoe[1] an array?');
            assert(Array.isArray(uri_query.tictactoe[2]), 'tictactoe[2] an array?');
            assert.strictEqual(uri_query.tictactoe[0][0], 'X');
            assert.strictEqual(uri_query.tictactoe[0][1], 'O');
            assert.strictEqual(uri_query.tictactoe[0][2], 'X');
            assert.strictEqual(uri_query.tictactoe[1][0], 'O');
            assert.strictEqual(uri_query.tictactoe[1][1], 'X');
            assert.strictEqual(uri_query.tictactoe[1][2], 'O');
            assert.strictEqual(uri_query.tictactoe[2][0], 'X');
            assert.strictEqual(uri_query.tictactoe[2][1], 'O');
            assert.strictEqual(uri_query.tictactoe[2][2], 'X');
            assert.strictEqual(`${ uri_query }`, '?tictactoe[0][0]=X&tictactoe[0][1]=O&tictactoe[0][2]=X&tictactoe[1][0]=O&tictactoe[1][1]=X&tictactoe[1][2]=O&tictactoe[2][0]=X&tictactoe[2][1]=O&tictactoe[2][2]=X');
        }
    }

    function test_for_set() {
        let uri_query = new Uri_query({ fish: new Set([ '1', 2, 'red', '%230000FF' ]) });
        assert(uri_query.fish instanceof Set, 'fish a set? (1)');
        assert.strictEqual(uri_query.fish.has('1'), true, 'has "1"?');
        assert.strictEqual(uri_query.fish.has(2), true, 'has 2?');
        assert.strictEqual(uri_query.fish.has('red'), true, 'has "red"?');
        assert.strictEqual(uri_query.fish.has('#0000FF'), true, 'has "#0000FF"?');
        assert.strictEqual(`${ uri_query }`, '?fish[]=1&fish[]=2&fish[]=red&fish[]=%230000FF');

        uri_query = new Uri_query('?fish[]=two&fish[]=one');
        assert(uri_query.fish instanceof Set, 'fish a set? (2)');
        assert.strictEqual(uri_query.fish.has('one'), true, 'has "one"?');
        assert.strictEqual(uri_query.fish.has('two'), true, 'has "two"?');
        assert.strictEqual(`${ uri_query }`, '?fish[]=two&fish[]=one');
    }

    function test_for_flat_object() {
        const uri_queries = [
            new Uri_query('?q=jordans&filters[status]=in-stock&filters[price]=100-200'),
            new Uri_query({
                q: 'jordans',
                filters: { status: 'in-stock', price: '100-200' },
                }), // eslint-disable-line indent
            ]; // eslint-disable-line indent
        for (const uri_query of uri_queries) {
            assert.strictEqual(uri_query.q, 'jordans');
            assert.strictEqual(uri_query.filters.status, 'in-stock');
            assert.strictEqual(uri_query.filters.price, '100-200');
            assert.strictEqual(`${ uri_query }`, '?filters[price]=100-200&filters[status]=in-stock&q=jordans');
        }
    }

    function test_for_mixed_object() {
        const uri_queries = [
            new Uri_query('?q=jordans&filters[status]=in-stock&filters[price][range][0]=100&filters[price][range][1]=200&filters[price][currency]=USD'),
            new Uri_query({
                q: 'jordans',
                filters: {
                    status: 'in-stock',
                    price: { range: [ '100', '200' ], currency: 'USD' },
                    }, // eslint-disable-line indent
                }), // eslint-disable-line indent
            ]; // eslint-disable-line indent
        for (const uri_query of uri_queries) {
            assert.strictEqual(uri_query.q, 'jordans');
            assert.strictEqual(uri_query.filters.status, 'in-stock');
            assert.strictEqual(uri_query.filters.price.range[0], '100');
            assert.strictEqual(uri_query.filters.price.range[1], '200');
            assert.strictEqual(`${ uri_query }`, '?filters[price][currency]=USD&filters[price][range][0]=100&filters[price][range][1]=200&filters[status]=in-stock&q=jordans');
        }
    }

    function test_for_inherited_values() {
        function Searcher(params) {
            Object.assign(this, params);
        }
        Object.assign(Searcher.prototype, { page: 0, per_page: 10 });
        const uri_query = new Uri_query(
            new Searcher({ q: 'hello+world', per_page: 100 }),
            ); // eslint-disable-line indent
        assert.strictEqual(`${ uri_query }`, '?page=0&per_page=100&q=hello%20world');
    }
}(
    require('assert'),
    require('../index.js'),
));
