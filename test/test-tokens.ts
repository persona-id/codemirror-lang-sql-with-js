import ist from "ist"
import {MySQLWithJS, PostgreSQLWithJS, SQLDialectWithJS, StandardSQLWithJS} from "@persona-id/codemirror-lang-sql-with-js"

// get diff languages
const standardTokens = StandardSQLWithJS.language
const mysqlTokens = MySQLWithJS.language
const postgresqlTokens = PostgreSQLWithJS.language
const bigQueryTokens = SQLDialectWithJS.define({
  treatBitsAsBytes: true
}).language

describe("Parses Standard Token", ()=> {
  const parser = standardTokens.parser
  it("parses embedded Javascript directive", () => {
    ist(parser.parse("{{ parseInt(user.id) }}"), 'Script(Statement(Directive))')
  })
})

describe("Parse MySQL tokens", () => {
  const parser = mysqlTokens.parser

  it("parses quoted bit-value literals", () => {
    ist(parser.parse("SELECT b'0101'"), 'Script(Statement(Keyword,Bits))')
  })

  it("parses unquoted bit-value literals", () => {
    ist(parser.parse("SELECT 0b01"), 'Script(Statement(Keyword,Bits))')
  })
})

describe("Parse PostgreSQL tokens", () => {
  const parser = postgresqlTokens.parser

  it("parses quoted bit-value literals", () => {
    ist(parser.parse("SELECT b'0101'"), 'Script(Statement(Keyword,Bits))')
  })

  it("parses quoted bit-value literals", () => {
    ist(parser.parse("SELECT B'0101'"), 'Script(Statement(Keyword,Bits))')
  })

  it("parses double dollar quoted string literals", () => {
    ist(parser.parse("SELECT $$hello$$"), 'Script(Statement(Keyword,String))')
  })
})

describe("Parse BigQuery tokens", () => {
  const parser = bigQueryTokens.parser

  it("parses quoted bytes literals in single quotes", () => {
    ist(parser.parse("SELECT b'abcd'"), 'Script(Statement(Keyword,Bytes))')
  })

  it("parses quoted bytes literals in double quotes", () => {
    ist(parser.parse('SELECT b"abcd"'), 'Script(Statement(Keyword,Bytes))')
  })

  it("parses bytes literals in single quotes", () => {
    ist(parser.parse("SELECT b'0101'"), 'Script(Statement(Keyword,Bytes))')
  })

  it("parses bytes literals in double quotes", () => {
    ist(parser.parse('SELECT b"0101"'), 'Script(Statement(Keyword,Bytes))')
  })
})
