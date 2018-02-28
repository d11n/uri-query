// eslint-disable-next-line max-params
(function main(assert, Uri_query) {
    describe('Uri_query instance', describe_instance);
    return true;

    // -----------

    function describe_instance() {
        it('composes as empty string in all expected cases', test_for_empty);
        it('trims white space and ampersands', test_for_trimming);
        it('throws when constructing with non-sense', test_for_construct_error);
        return true;
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
        return true;
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
        return true;
    }
    function test_for_construct_error() {
        assert.throws(() => new Uri_query(test_for_construct_error), TypeError);
        return true;
    }
}(
    require('assert'),
    require('./index.js'),
));
