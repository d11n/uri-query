# URI Query
#### Parse and manipulate URI queries according to different strategies

[![Travis](https://img.shields.io/travis/d11n/uri-query.svg?style=flat-square)](https://travis-ci.org/d11n/uri-query)
[![Coverage Status](https://img.shields.io/coveralls/github/d11n/uri-query.svg?style=flat-square)](https://coveralls.io/github/d11n/uri-query)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/d11n/uri-query.svg?style=flat-square)](https://codeclimate.com/github/d11n/uri-query)
[![Codacy grade](https://img.shields.io/codacy/grade/c0a7abfd51584b148e6c37a68d5ea872.svg?style=flat-square)](https://www.codacy.com/app/d11n/uri-query)
[![license](https://img.shields.io/github/license/d11n/uri-query.svg?style=flat-square)](https://github.com/d11n/uri-query/blob/master/LICENSE)

The URI specification RFC3986 defines very few rules on how URI queries are to be parsed. It merely states that URI queries are "non-hierarchical data" (in contrast to URI paths) and that "key=value" pairs are "often used". This module supports using pre-defined or defining your own URI query parsing strategies that support your framework of choice, personal preferences, legacy requirements, etc.

The default strategy notably supports:
<table><tbody>
    <tr>
        <td><strong>Objects</strong></td>
        <td><code>?filters[price]=50-100</code></td>
    </tr>
    <tr>
        <td><strong>Arrays</strong></td>
        <td><code>?platforms[0]=chrome&platforms[1]=opera</code></td>
    </tr>
    <tr>
        <td><strong>Sets</strong></td>
        <td><code>?platforms[]=chrome&platforms[]=opera</code></td>
    </tr>
    <tr>
        <td><strong>Multidimensional Structures</strong></td>
        <td><code>?q=jordans&filters[status]=in-stock&filters[price][range][0]=100&filters[price][range][1]=200&filters[price][currency]=USD</code></td>
    </tr>
    <tr>
        <td><strong>True</strong></td>
        <td><code>?view-all</code></td>
    </tr>
    <tr>
        <td><strong>Null</strong></td>
        <td><code>?q=</code></td>
    </tr>
</tbody></table>

## Installation
```
npm add uri-query
```

This module makes use of ES2015 features, but does not polyfill them. You will need to implement your own if the environment you are deploying to does not support:

<table><tbody>
    <tr>
        <td><strong>Sets</strong></td>
        <td>Node 0.12+</td>
        <td>IE11</td>
        <td>Edge</td>
    </tr>
    <tr>
        <td><strong>Object.assign()</strong></td>
        <td>Node 6.4+</td>
        <td><strike>IE</strike></td>
        <td>Edge</td>
    </tr>
    <tr>
        <td><strong>String.prototype.includes()</strong></td>
        <td>Node 4+</td>
        <td><strike>IE</strike></td>
        <td>Edge</td>
    </tr>
    <tr>
        <td><strong>Array.prototype.includes()</strong></td>
        <td>Node 6.13+</td>
        <td><strike>IE</strike></td>
        <td>Edge14+</td>
    </tr>
</tbody></table>

## Specification Compliance

### From [RFC3986: 3.4.  Query](https://tools.ietf.org/html/rfc3986#section-3.4)
<blockquote><pre>
The query component contains non-hierarchical data that, along with
data in the path component (Section 3.3), serves to identify a
resource within the scope of the URI's scheme and naming authority
(if any).  The query component is indicated by the first question
mark ("?") character and terminated by a number sign ("#") character
or by the end of the URI.
<br/>
query = *( pchar / "/" / "?" )
<br/>
The characters slash ("/") and question mark ("?") may represent data
within the query component.  Beware that some older, erroneous
implementations may not handle such data correctly when it is used as
the base URI for relative references (Section 5.1), apparently
because they fail to distinguish query data from path data when
looking for hierarchical separators.  However, as query components
are often used to carry identifying information in the form of
"key=value" pairs and one frequently used value is a reference to
another URI, it is sometimes better for usability to avoid percent-
encoding those characters.
</pre></blockquote>

### From [RFC3986: Appendix A.  Collected ABNF for URI](https://tools.ietf.org/html/rfc3986#appendix-a)
<blockquote><pre>
...
pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
...
pct-encoded   = "%" HEXDIG HEXDIG
...
unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
...
sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
                 / "*" / "+" / "," / ";" / "="
...
</pre></blockquote>

### From [RFC2234: 6.1  Core Rules](https://tools.ietf.org/html/rfc2234#section-6.1)
<blockquote><pre>
...
ALPHA          =  %x41-5A / %x61-7A   ; A-Z / a-z
...
DIGIT          =  %x30-39
                       ; 0-9
...
HEXDIG         =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
...
</pre></blockquote>
