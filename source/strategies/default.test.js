// eslint-disable-next-line max-params
(function main(assert, Uri_query) {
    describe(
        'Uri_query default parsing strategy',
        describe_default_parsing_strategy,
        ); // eslint-disable-line indent
    describe(
        'Uri_query default composition strategy',
        describe_default_composition_strategy,
        ); // eslint-disable-line indent
    return true;

    // -----------

    function describe_default_parsing_strategy() {
        it('separates pairs on "&"', test_for_separator);
        it('ignores empty pairs', test_for_empty_pairs);
        it('interprets omitted "=" as true', test_for_true);
        it('interprets omitted value as null', test_for_null);
        it('interprets odd occurrences of "=" sanely', test_for_equals);
        it('decodes keys and values', test_for_decoding);
        return true;
    }
    function test_for_separator() {
        const uri_query = new Uri_query(
            '?one=fish&2=fish&red=fish&%230000FF=fish',
            ); // eslint-disable-line indent
        assert.strictEqual(uri_query.one, 'fish');
        assert.strictEqual(uri_query['2'], 'fish');
        assert.strictEqual(uri_query.red, 'fish');
        assert.strictEqual(uri_query['#0000FF'], 'fish');
        assert.strictEqual(
            `${ uri_query }`,
            '?%230000FF=fish&2=fish&one=fish&red=fish',
            ); // eslint-disable-line indent
        return true;
    }
    function test_for_empty_pairs() {
        const uri_query = new Uri_query('?&&&foo=bar&&&bar=baz&&&');
        assert.strictEqual(uri_query.foo, 'bar');
        assert.strictEqual(uri_query.bar, 'baz');
        assert.strictEqual(`${ uri_query }`, '?bar=baz&foo=bar');
        return true;
    }
    function test_for_true() {
        const uri_query = new Uri_query('?yes');
        assert.strictEqual(uri_query.yes, true);
        return true;
    }
    function test_for_null() {
        const uri_query = new Uri_query('?nil=');
        assert.strictEqual(uri_query.nil, null);
        return true;
    }
    // eslint-disable-next-line max-statements
    function test_for_equals() {
        let uri_query = new Uri_query('?bar===&bone=8==8');
        assert.strictEqual(uri_query.bar, '==');
        assert.strictEqual(uri_query.bone, '8==8');
        uri_query = new Uri_query('?=');
        assert.strictEqual(uri_query['='], true);
        uri_query = new Uri_query('?%3D');
        assert.strictEqual(uri_query['='], true);
        uri_query = new Uri_query('?==');
        assert.strictEqual(uri_query['='], null);
        uri_query = new Uri_query('?%3D=&%3D%3D');
        assert.strictEqual(uri_query['='], null);
        assert.strictEqual(uri_query['=='], true);
        uri_query = new Uri_query('?===');
        assert.strictEqual(uri_query['='], '=');
        uri_query = new Uri_query('?=%3D');
        assert.strictEqual(uri_query['=='], true);
        return true;
    }
    function test_for_decoding() {
        const uri_queries = [
            new Uri_query('%24=1%2C000%2C000&title=%22Laser%22&purpose=Punch+a%20hole+in+the+%22Ozone%20Layer%22'), // eslint-disable-line max-len
            new Uri_query('$=1,000,000&title="Laser"&purpose=Punch a hole in the "Ozone Layer"'), // eslint-disable-line max-len
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
            assert.strictEqual(
                uri_query.purpose,
                'Punch a hole in the "Ozone Layer"',
                ); // eslint-disable-line indent
            assert.strictEqual(
                `${ uri_query }`,
                '?%24=1%2C000%2C000&purpose=Punch%20a%20hole%20in%20the%20%22Ozone%20Layer%22&title=%22Laser%22', // eslint-disable-line max-len
                ); // eslint-disable-line indent
        }
        return true;
    }

    // -----------

    function describe_default_composition_strategy() {
        it('composes true as "key", null as "key="', test_for_true_null);
        it('composes array as indexed sequence', test_for_array);
        it('composes multidimensional array', test_for_multidimensional);
        it('composes flat object', test_for_flat_object);
        it('composes object with composite values', test_for_mixed_object);
        it('composes object with inherited values', test_for_descendant_object);
        return true;
    }
    function test_for_true_null() {
        const uri_query = new Uri_query({ yes: true, nil: null });
        assert.strictEqual(`${ uri_query }`, '?nil=&yes');
        return true;
    }
    function test_for_array() {
        const uri_query = new Uri_query({ fish: [ '1', 2, 'red', 'blue' ] });
        assert.strictEqual(
            `${ uri_query }`,
            '?fish[0]=1&fish[1]=2&fish[2]=red&fish[3]=blue',
            ); // eslint-disable-line indent
        return true;
    }
    function test_for_multidimensional() {
        const uri_query = new Uri_query({ tictactoe: [
            [ 'X', 'O', 'X' ],
            [ 'O', 'X', 'O' ],
            [ 'X', 'O', 'X' ],
            ]}); // eslint-disable-line
        assert.strictEqual(
            `${ uri_query }`,
            '?tictactoe[0][0]=X&tictactoe[0][1]=O&tictactoe[0][2]=X&tictactoe[1][0]=O&tictactoe[1][1]=X&tictactoe[1][2]=O&tictactoe[2][0]=X&tictactoe[2][1]=O&tictactoe[2][2]=X', // eslint-disable-line max-len
            ); // eslint-disable-line indent
        return true;
    }
    function test_for_flat_object() {
        const uri_query = new Uri_query({
            filters: {
                status: 'published',
                price: '50-100',
                }, // eslint-disable-line
            }); // eslint-disable-line
        assert.strictEqual(
            `${ uri_query }`,
            '?filters[price]=50-100&filters[status]=published',
            ); // eslint-disable-line indent
        return true;
    }
    function test_for_mixed_object() {
        const uri_query = new Uri_query({
            filters: {
                status: 'published',
                price: { range: [ 50, 100 ], currency: 'USD' },
                }, // eslint-disable-line
            }); // eslint-disable-line
        assert.strictEqual(
            `${ uri_query }`,
            '?filters[price][currency]=USD&filters[price][range][0]=50&filters[price][range][1]=100&filters[status]=published', // eslint-disable-line max-len
            ); // eslint-disable-line indent
        return true;
    }
    function test_for_descendant_object() {
        function Searcher(params) {
            Object.assign(this, params);
        }
        Object.assign(Searcher.prototype, { page: 0, per_page: 10 });
        const uri_query = new Uri_query(
            new Searcher({ q: 'hello+world', per_page: 100 }),
            ); // eslint-disable-line indent
        assert.strictEqual(
            `${ uri_query }`,
            '?page=0&per_page=100&q=hello%20world',
            ); // eslint-disable-line indent
        return true;
    }
}(
    require('assert'),
    require('../index.js'),
));
