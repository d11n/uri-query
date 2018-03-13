/* eslint-disable max-len *//* eslint-disable max-statements */
// eslint-disable-next-line max-params
(function main(assert, Uri_query) {
    describe('Uri_query class', describe_class);
    describe('Uri_query instance', describe_instance);
    return true;

    // -----------

    function describe_class() {
        it('Uri_query.is_encoded', test_for_encoding_check);
    }
    function test_for_encoding_check() {
        /* eslint-disable indent */
        const valid_uri_query_strings = [
            '',
            '?',
            '#',
            '?#',
            '?#😱', // invalid fragments do not make the query invalid
            // "pchar" > "unreserved"
                '?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', // ALPHA
                '?0123456789', // DIGIT
                '?-._~',
            '?%00%0F%FF', // "pchar" > "pct-encoded"
            '?!$&\'()*+,;=', // "pchar" > "sub-delims"
            '?:@', // "pchar"
            '?/?', // "query"
            ]; // eslint-disable-line indent
        /* eslint-enabled indent */
        for (const query_string of valid_uri_query_strings) {
            assert.strictEqual(
                Uri_query.is_encoded(query_string),
                true,
                query_string,
                ); // eslint-disable-line indent
        }

        const invalid_uri_query_strings = [
            ' ',
            '? ',
            '?^',
            '?"',
            '?`',
            '?|',
            '?\\',
            '?<',
            '?>',
            '?[',
            '?]',
            '?{',
            '?}',
            '?%',
            '?%0',
            '?%A',
            '?%aa',
            '?%9G',
            '?%%',
            '?100%',
            '?utf8=✔︎',
            ]; // eslint-disable-line indent
        for (const query_string of invalid_uri_query_strings) {
            assert.strictEqual(
                Uri_query.is_encoded(query_string),
                false,
                query_string,
                ); // eslint-disable-line indent
        }
    }

    // -----------

    function describe_instance() {
        it('composes as empty string in all expected cases', test_for_empty);
        it('trims white space and ampersands', test_for_trimming);
        it('throws when constructing with nonsense', test_for_construct_error);
        it('does not throw when coercing with nonsense', test_for_coerce_error);
        describe('if alter_params is defined', describe_alter_params);
    }
    function test_for_empty() {
        const empty_string_uri_queries = [
            new Uri_query,
            new Uri_query(null),
            new Uri_query(''),
            new Uri_query('?'),
            new Uri_query('#'),
            new Uri_query('?#'),
            new Uri_query('#fragment'),
            new Uri_query({}),
            ]; // eslint-disable-line indent
        for (const uri_query of empty_string_uri_queries) {
            assert.strictEqual(`${ uri_query }`, '');
        }
    }
    function test_for_trimming() {
        const empty_string_uri_queries = [
            new Uri_query(' '),
            new Uri_query(' ? '),
            new Uri_query(' & '),
            new Uri_query(' # '),
            new Uri_query(' ?& '),
            new Uri_query(' &# '),
            new Uri_query(' ? & '),
            new Uri_query(' & # '),
            new Uri_query('?&#'),
            new Uri_query(' ? & # '),
            new Uri_query(' & &# '),
            new Uri_query('? & & #'),
            new Uri_query('?&&&#'),
            ]; // eslint-disable-line indent
        for (const uri_query of empty_string_uri_queries) {
            assert.strictEqual(`${ uri_query }`, '');
        }
        const yo_uri_queries = [
            new Uri_query(' yo=yo '),
            new Uri_query('?&yo=yo&#'),
            new Uri_query('? & yo=yo & #'),
            ]; // eslint-disable-line indent
        for (const uri_query of yo_uri_queries) {
            assert.strictEqual(`${ uri_query }`, '?yo=yo');
        }
    }
    function test_for_construct_error() {
        assert.throws(() => new Uri_query(test_for_construct_error), TypeError);
    }
    function test_for_coerce_error() {
        assert.doesNotThrow(() => Uri_query(test_for_construct_error));
    }

    // -----------

    function describe_alter_params() {
        it('alters/recomposes single parse function', test_for_alter_params_parse_function);
        it('alters/recomposes parse/compose object', test_for_alter_params_parse_compose_object);
    }
    function test_for_alter_params_parse_function() {
        let uri_query = new Uri_query(`?qty=2`);
        assert.strictEqual(uri_query.qty, '2');
        assert.strictEqual(`${ uri_query }`, '?qty=2');

        uri_query = new Uri_query(`?qty=2`, { qty: Number });
        assert.strictEqual(uri_query.qty, 2);
        assert.strictEqual(`${ uri_query }`, '?qty=2');
    }
    function test_for_alter_params_parse_compose_object() {
        let uri_query = new Uri_query(
            `?sort_by=last_name.asc,first_name.asc`,
            { sort_by: parse_sort_list },
            ); // eslint-disable-line indent
        assert(Array.isArray(uri_query.sort_by));
        assert.strictEqual(uri_query.sort_by[0].last_name, 'asc');
        assert.strictEqual(uri_query.sort_by[1].first_name, 'asc');
        assert.strictEqual(`${ uri_query }`, '?sort_by[0][last_name]=asc&sort_by[1][first_name]=asc');

        uri_query = new Uri_query(
            `?sort_by=last_name.asc,first_name.asc`,
            { sort_by: { parse: parse_sort_list, compose: compose_sort_list } },
            ); // eslint-disable-line indent
        assert(Array.isArray(uri_query.sort_by));
        assert.strictEqual(uri_query.sort_by[0].last_name, 'asc');
        assert.strictEqual(uri_query.sort_by[1].first_name, 'asc');
        assert.strictEqual(`${ uri_query }`, '?sort_by=last_name.asc%2Cfirst_name.asc');

        // -----------

        function parse_sort_list(sort_list) {
            return sort_list
                .split(',')
                .map(parse_sort_item)
                ; // eslint-disable-line indent

            // -----------

            function parse_sort_item(sort_item) {
                const item = sort_item.split('.');
                return { [ item[0] ]: item[1] };
            }
        }

        function compose_sort_list(sort_by) {
            const sort_array = [];
            for (let i = 0, n = sort_by.length - 1; i <= n; i++) {
                const sort_item = sort_by[i];
                const key = Object.keys(sort_item)[0];
                sort_array.push(`${ key }.${ sort_item[key] }`);
            }
            return sort_array.join(',');
        }
    }
}(
    require('assert'),
    require('./index.js'),
));
