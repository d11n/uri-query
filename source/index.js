// eslint-disable-next-line max-params
(function main(DEFAULT_STRATEGY) {
    return module.exports = Object.freeze(Uri_query);

    // -----------

    function Uri_query(parsee, alter_params) {
        const this_uri_query = this;
        if (!(this_uri_query instanceof Uri_query)) {
            // Coercion doesn't throw
            try {
                return new Uri_query(parsee, alter_params);
            } catch (exception) {
                return new Uri_query;
            }
        }
        const strategy = DEFAULT_STRATEGY;
        Object.defineProperty(this_uri_query, 'toString', {
            value: () => strategy.compose_query_string(this_uri_query),
            enumerable: false,
            }); // eslint-disable-line indent
        if (undefined !== parsee && null !== parsee) {
            Object.assign(
                this_uri_query,
                parse_parsee(parsee, strategy, alter_params),
                ); // eslint-disable-line indent
        }
        return this_uri_query;
    }
    function parse_parsee(parsee, strategy, alter_params) {
        let parsed_query_object;
        switch (true) {
            case 'string' === typeof parsee:
            case 'number' === typeof parsee:
            case 'boolean' === typeof parsee:
            case 'symbol' === typeof parsee:
                parsed_query_object
                    = parse_query_string(String(parsee), strategy)
                    ; // eslint-disable-line indent
                break;
            case 'object' === typeof parsee:
                parsed_query_object = parse_query_params(parsee, strategy);
                break;
        }
        if (parsed_query_object) {
            return alter_params
                ? alter_query_object(parsed_query_object, alter_params)
                : parsed_query_object
                ; // eslint-disable-line indent
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

    // -----------

    function alter_query_object(query_object, alter_params) {
        const altered_object = Object.assign({}, query_object);
        const query_keys = Object.keys(query_object);
        const alter_keys = Object.keys(alter_params);
        for (const key of alter_keys) {
            if (query_keys.includes(key)) {
                const alter_value = alter_params[key];
                altered_object[key] = alter_value(altered_object[key]);
            }
        }
        return altered_object;
    }
}(
    require('./strategies/default'),
));
