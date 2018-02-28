// eslint-disable-next-line max-params
(function main(DEFAULT_STRATEGY) {
    return module.exports = Object.freeze(Uri_query);

    // -----------

    function Uri_query(arg) {
        const this_uri_query = this;
        if (!(this_uri_query instanceof Uri_query)) {
            // Coercion doesn't throw
            try {
                return new Uri_query(arg);
            } catch (exception) {
                return new Uri_query;
            }
        }
        const strategy = DEFAULT_STRATEGY;
        Object.defineProperty(this_uri_query, 'toString', {
            value: () => strategy.compose_query_string(this),
            enumerable: false,
            }); // eslint-disable-line indent
        if (undefined !== arg && null !== arg) {
            Object.assign(
                this_uri_query,
                validate_constructor_args(arg, strategy),
                ); // eslint-disable-line indent
        }
        return this_uri_query;
    }
    function validate_constructor_args(arg, strategy) {
        switch (true) {
            case 'string' === typeof arg:
            case 'number' === typeof arg:
            case 'boolean' === typeof arg:
            case 'symbol' === typeof arg:
                return parse_query_string(String(arg), strategy);
            case 'object' === typeof arg:
                return parse_query_params(arg, strategy);
        }
        throw new TypeError([
            'URI queries must be constructed with a primitive value',
            'or an object',
            ].join(' ')); // eslint-disable-line indent
    }

    // -----------

    function parse_query_string(raw_query_string, strategy) {
        const trimmed_raw_query_string = raw_query_string.trim();
        if ([ '', '?', '#', '?#' ].includes(trimmed_raw_query_string)) {
            return {};
        }
        const hash_index = trimmed_raw_query_string.indexOf('#');
        /* eslint-disable indent */
        const query_string = trimmed_raw_query_string
            .substring(
                '?' === trimmed_raw_query_string.substring(0, 1) ? 1 : 0,
                -1 === hash_index ? undefined : hash_index,
                )
            .replace(/(?:^[&\s]+|[&\s]+$)/g, '') // trim white space and &'s
            ;
        /* eslint-enable indent */
        if ('' === query_string) {
            return {};
        }
        return strategy.parse_query_string(query_string);
    }

    function parse_query_params(raw_object, strategy) {
        const flattened_proto_object = {};
        // eslint-disable-next-line guard-for-in
        for (const key in raw_object) {
            const value = raw_object[key];
            switch (true) {
                case undefined === value:
                case null === value:
                case 'string' === typeof value:
                case 'number' === typeof value:
                case 'boolean' === typeof value:
                case 'symbol' === typeof value:
                case 'object' === typeof value:
                    flattened_proto_object[key] = value;
            }
        }
        return strategy.parse_query_params(flattened_proto_object);
    }
}(
    require('./strategies/default'),
));
