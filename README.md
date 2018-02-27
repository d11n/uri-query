# URI Query
Strictly parse and manipulate URI queries

### From [RFC3986: 3.4.  Query](https://tools.ietf.org/html/rfc3986#section-3.4)
<blockquote><pre>
The query component contains non-hierarchical data that, along with
data in the path component (Section 3.3), serves to identify a
resource within the scope of the URI's scheme and naming authority
(if any).  The query component is indicated by the first question
mark ("?") character and terminated by a number sign ("#") character
or by the end of the URI.

query = *( pchar / "/" / "?" )

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
