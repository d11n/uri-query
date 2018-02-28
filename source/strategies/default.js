// eslint-disable-next-line max-params
(function main(encode, decode) {
    return module.exports = Object.freeze({
        parse_query_string,
        parse_query_params,
        compose_query_string,
        }); // eslint-disable-line indent

    // -----------

    function parse_query_string(query_string) {
        const query_object = {};
        const query_pairs = query_string.split(/&+/);
        for (const pair of query_pairs) {
            let separator_index = pair.indexOf('=');
            if (0 === separator_index) {
                separator_index = pair.indexOf('=', 1);
            }
            /* eslint-disable indent */
            const key = decode(pair.substring(
                0,
                -1 === separator_index ? undefined : separator_index,
                ));
            const value
                = -1 === separator_index ? true
                : pair.length === separator_index + 1 ? null
                : decode(pair.substring(separator_index + 1))
                ;
            /* eslint-enable indent */
            if (is_composite_key(key)) {
                add_composite_value(key, value);
            } else {
                query_object[ decode(key) ] = value;
            }
        }
        return query_object;

        // -----------

        function is_composite_key(key) {
            return key.includes('[') && key.includes(']') || key.includes('.');
        }
        function add_composite_value(key, value) {
            const path_keys = get_path_keys(key);
            let query_object_value = query_object;
            for (let i = 0, n = path_keys.length - 1; i <= n; i++) {
                const path_key = path_keys[i];
                if (i === n) {
                    if (null === path_key
                        && query_object_value instanceof Set
                        ) { // eslint-disable-line indent
                        query_object_value.add(value);
                    } else {
                        /* eslint-disable indent */
                        const real_path_key
                            = Array.isArray(query_object_value) ? path_key
                            : null === path_key ? ''
                            : String(path_key)
                            ;
                        /* eslint-enable indent */
                        query_object_value[real_path_key] = value;
                    }
                } else {
                    ensure_query_object_value(path_key, path_keys[i + 1]);
                }
            }
            return true;

            // -----------

            function ensure_query_object_value(path_key, next_path_key) {
                if (!query_object_value[path_key]) {
                    /* eslint-disable indent */
                    query_object_value[path_key]
                        = 'number' === typeof next_path_key ? []
                        : null === next_path_key ? new Set
                        : {}
                        ;
                    /* eslint-enable indent */
                } else if ('string' === typeof next_path_key
                    && Array.isArray(query_object_value[path_key])
                    ) { // eslint-disable-line indent
                    query_object_value[path_key] = convert_to_object(
                        query_object_value[path_key],
                        ); // eslint-disable-line indent
                } else if ('string' === typeof next_path_key
                    && query_object_value[path_key] instanceof Set
                    ) { // eslint-disable-line indent
                    query_object_value[path_key] = convert_to_object(
                        Array.from(query_object_value[path_key]),
                        ); // eslint-disable-line indent
                }
                query_object_value = query_object_value[path_key];
                return true;
            }
            function convert_to_object(arr) {
                const obj = {};
                const indices = Object.keys(arr);
                for (const index of indices) {
                    obj[String(index)] = arr[index];
                }
                return obj;
            }
        }
        function get_path_keys(path_string) {
            const path_keys = [];
            let unparsed_path = path_string;
            while (unparsed_path) {
                const open_brack_i = unparsed_path.indexOf('[');
                if (0 === open_brack_i) {
                    const close_brack_i
                        = unparsed_path.indexOf(']', open_brack_i)
                        ; // eslint-disable-line indent
                    path_keys.push(
                        unparsed_path.substring(1, close_brack_i),
                        ); // eslint-disable-line indent
                    unparsed_path = unparsed_path.substring(close_brack_i + 1);
                } else {
                    let path_key = -1 === open_brack_i
                        ? unparsed_path
                        : unparsed_path.substring(0, open_brack_i)
                        ; // eslint-disable-line indent
                    '.' === path_key[0] && (path_key = path_key.substring(1));
                    path_keys.push(path_key);
                    unparsed_path = -1 === open_brack_i
                        ? ''
                        : unparsed_path.substring(open_brack_i)
                        ; // eslint-disable-line indent
                }
            }
            return path_keys.map(coerce_numbers);

            // -----------

            function coerce_numbers(item) {
                return '' === item ? null
                    : !isNaN(item) && 'Infinity' !== item ? Number(item)
                    : item // eslint-disable-line indent
                    ; // eslint-disable-line indent
            }
        }
    }

    function parse_query_params(query_params) {
        if (query_params instanceof Set) {
            return new Set(parse_query_params(Array.from(query_params)));
        }
        const query_object = Array.isArray(query_params) ? [] : {};
        const keys = Object.keys(query_params).sort();
        for (const raw_key of keys) {
            const key = decode(raw_key);
            const value = query_params[raw_key];
            switch (true) {
                case undefined === value:
                    query_object[key] = null;
                    break;
                case null === value:
                case '' === value:
                case 'number' === typeof value:
                case 'boolean' === typeof value:
                case 'symbol' === typeof value:
                    query_object[key] = value;
                    break;
                case 'string' === typeof value:
                    query_object[key] = decode(value);
                    break;
                case 'object' === typeof value:
                    query_object[key] = parse_query_params(value);
                    break;
            }
        }
        return query_object;
    }

    function compose_query_string(query_params) {
        if (!query_params || 'object' !== typeof query_params) {
            return '';
        }
        let uri_query = '';
        const keys = Object.keys(query_params).sort();
        for (const key of keys) {
            const separator = key === keys[0] ? '?' : '&';
            const value = query_params[key];
            switch (true) {
                case undefined === value:
                case null === value:
                case 'string' === typeof value:
                case 'number' === typeof value:
                case 'boolean' === typeof value:
                case 'symbol' === typeof value:
                    uri_query += `${ separator }${ compose_pair(key, value) }`;
                    break;
                case 'object' === typeof value:
                    uri_query
                        += `${ separator }${ compose_subquery(key, value) }`
                        ; // eslint-disable-line indent
                    break;
                // Ignore functions
            }
        }
        return uri_query;

        // -----------

        function compose_pair(key, value) {
            return `${ encode(key) }${ get_primitive_pair_suffix(value) }`;
        }
        function get_primitive_pair_suffix(value) {
            /* eslint-disable indent */
            return true === value ? ''
                : undefined === value || null === value ? '='
                : `=${ encode(String(value)) }`
                ;
            /* eslint-enable indent */
        }

        function compose_subquery(key, value) {
            return _compose_subquery(encode(key), value);
        }
        function _compose_subquery(key_prefix, iterable_value) {
            const subquery = [];
            if (iterable_value instanceof Set) {
                for (const item of iterable_value) {
                    const key = `${ key_prefix }[]`;
                    const value = item;
                    const pair = get_to_subquery_pair(subquery, key, value);
                    pair && subquery.push(pair);
                }
                return subquery.join('&');
            }
            // Force predictable order of keys for testability
            const subquery_keys = Object.keys(iterable_value).sort();
            for (const raw_key of subquery_keys) {
                const key = `${ key_prefix }[${ encode(raw_key) }]`;
                const value = iterable_value[raw_key];
                const pair = get_to_subquery_pair(subquery, key, value);
                pair && subquery.push(pair);
            }
            return subquery.join('&');
        }
        function get_to_subquery_pair(subquery, key, value) {
            switch (true) {
                case undefined === value:
                case null === value:
                case 'string' === typeof value:
                case 'number' === typeof value:
                case 'boolean' === typeof value:
                case 'symbol' === typeof value:
                    return `${ key }${ get_primitive_pair_suffix(value) }`;
                case 'object' === typeof value:
                    return _compose_subquery(key, value);
            }
            return null;
        }
    }
}(
    require('strict-uri-encode'),
    require('decode-uri-component'),
));
