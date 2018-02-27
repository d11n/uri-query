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
            if (-1 === separator_index) {
                query_object[ decode(pair) ] = true;
            } else {
                if (0 === separator_index) {
                    separator_index = pair.substring(1).indexOf('=') + 1;
                }
                if (0 === separator_index) {
                    query_object[ decode(pair) ] = true;
                } else {
                    const key = pair.substring(0, separator_index);
                    const value = pair.substring(separator_index + 1);
                    query_object[ decode(key) ] = '' === value
                        ? null
                        : decode(value)
                        ; // eslint-disable-line indent
                }
            }
        }
        return query_object;
    }

    function parse_query_params(query_params) {
        const query_object = {};
        const keys = Object.keys(query_params).sort();
        for (const raw_key of keys) {
            const key = decode(raw_key);
            const value = query_params[raw_key];
            switch (true) {
                case undefined === value:
                case null === value:
                case '' === value:
                    query_object[key] = null;
                    break;
                case 'string' === typeof value:
                    query_object[key] = decode(value);
                    break;
                case 'number' === typeof value:
                case 'boolean' === typeof value:
                case 'symbol' === typeof value:
                    query_object[key] = value;
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
            const subquery_keys = Object.keys(iterable_value).sort();
            for (const raw_key of subquery_keys) {
                const key = `${ key_prefix }[${ encode(raw_key) }]`;
                const value = iterable_value[raw_key];
                switch (true) {
                    case undefined === value:
                    case null === value:
                    case 'string' === typeof value:
                    case 'number' === typeof value:
                    case 'boolean' === typeof value:
                    case 'symbol' === typeof value:
                        subquery.push([
                            key,
                            get_primitive_pair_suffix(value),
                            ].join('')); // eslint-disable-line indent
                        break;
                    case 'object' === typeof value:
                        subquery.push(_compose_subquery(key, value));
                        break;
                }
            }
            return subquery.join('&');
        }
    }
}(
    require('strict-uri-encode'),
    require('decode-uri-component'),
));
