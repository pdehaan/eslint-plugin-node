/**
 * @fileoverview Tests for no-deprecated-api rule.
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const RuleTester = require("eslint/lib/testers/rule-tester")
const rule = require("../../../lib/rules/no-deprecated-api")

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run("no-deprecated-api", rule, {
    valid: [
        {
            code: "require('buffer').Buffer",
            env: { node: true },
        },
        {
            code: "foo(require('buffer').Buffer)",
            env: { node: true },
        },
        {
            code: "new (require('another-buffer').Buffer)()",
            env: { node: true },
        },
        {
            code: "var http = require('http'); http.request()",
            env: { node: true },
        },
        {
            code: "var {request} = require('http'); request()",
            env: { node: true, es6: true },
        },
        {
            code: "(s ? require('https') : require('http')).request()",
            env: { node: true },
        },
        {
            code: "require(HTTP).createClient",
            env: { node: true },
        },
        {
            code: "import {Buffer} from 'another-buffer'; new Buffer()",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
        },
        {
            code: "import {request} from 'http'; request()",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
        },

        // On Node v6.8.0, fs.existsSync revived.
        {
            code: "require('fs').existsSync;",
            env: { node: true },
        },

        // use third parties.
        {
            code: "require('domain/');",
            env: { node: true },
        },
        {
            code: "import domain from 'domain/';",
            parserOptions: { sourceType: "module" },
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/55
        {
            code: "undefinedVar = require('fs')",
            env: { node: true },
        },

        // ignore options
        {
            code: "new (require('buffer').Buffer)()",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["new buffer.Buffer()"],
            }],
        },
        {
            code: "require('buffer').Buffer()",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["buffer.Buffer()"],
            }],
        },
        {
            code: "require('domain');",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["domain"],
            }],
        },
        {
            code: "require('events').EventEmitter.listenerCount;",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["events.EventEmitter.listenerCount"],
            }],
        },
        {
            code: "require('events').listenerCount;",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["events.listenerCount"],
            }],
        },
        {
            code: "new Buffer;",
            env: { node: true },
            options: [{ //
                ignoreGlobalItems: ["new Buffer()"],
            }],
        },
        {
            code: "Buffer();",
            env: { node: true },
            options: [{ //
                ignoreGlobalItems: ["Buffer()"],
            }],
        },
        {
            code: "Intl.v8BreakIterator;",
            env: { node: true },
            options: [{ //
                ignoreGlobalItems: ["Intl.v8BreakIterator"],
            }],
        },
        {
            code: "let {env: {NODE_REPL_HISTORY_FILE}} = process;",
            env: { node: true, es6: true },
            options: [{ //
                ignoreGlobalItems: ["process.env.NODE_REPL_HISTORY_FILE"],
            }],
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/65
        {
            code: "require(\"domain/\")",
            env: { node: true },
            options: [{ ignoreIndirectDependencies: true }],
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/87
        {
            code: "let fs = fs || require(\"fs\")",
            env: { node: true, es6: true },
        },
    ],
    invalid: [
        //----------------------------------------------------------------------
        // Modules
        //----------------------------------------------------------------------
        {
            code: "new (require('buffer').Buffer)()",
            env: { node: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "require('buffer').Buffer()",
            env: { node: true },
            errors: ["'buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var b = require('buffer'); new b.Buffer()",
            env: { node: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var b = require('buffer'); new b['Buffer']()",
            env: { node: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var b = require('buffer'); new b[`Buffer`]()",
            env: { node: true, es6: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var b = require('buffer').Buffer; new b()",
            env: { node: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var b; new ((b = require('buffer')).Buffer)(); new b.Buffer()",
            env: { node: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); new b()",
            env: { node: true, es6: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var {['Buffer']: b = null} = require('buffer'); new b()",
            env: { node: true, es6: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var {'Buffer': b = null} = require('buffer'); new b()",
            env: { node: true, es6: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "var {Buffer: b = require('buffer').Buffer} = {}; new b()",
            env: { node: true, es6: true },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "require('buffer').SlowBuffer",
            env: { node: true },
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "var b = require('buffer'); b.SlowBuffer",
            env: { node: true },
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "var {SlowBuffer: b} = require('buffer');",
            env: { node: true, es6: true },
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },

        //----------------------------------------------------------------------
        {
            code: "require('_linklist');",
            env: { node: true },
            errors: ["'_linklist' module was deprecated since v5."],
        },
        {
            code: "require('async_hooks').currentId;",
            env: { node: true },
            errors: ["'async_hooks.currentId' was deprecated since v8.2. Use 'async_hooks.executionAsyncId()' instead."],
        },
        {
            code: "require('async_hooks').triggerId;",
            env: { node: true },
            errors: ["'async_hooks.triggerId' was deprecated since v8.2. Use 'async_hooks.triggerAsyncId()' instead."],
        },
        {
            code: "require('constants');",
            env: { node: true },
            errors: ["'constants' module was deprecated since v6.3. Use 'constants' property of each module instead."],
        },
        {
            code: "require('crypto').Credentials;",
            env: { node: true },
            errors: ["'crypto.Credentials' was deprecated since v0.12. Use 'tls.SecureContext' instead."],
        },
        {
            code: "require('crypto').createCredentials;",
            env: { node: true },
            errors: ["'crypto.createCredentials' was deprecated since v0.12. Use 'tls.createSecureContext()' instead."],
        },
        {
            code: "require('domain');",
            env: { node: true },
            errors: ["'domain' module was deprecated since v4."],
        },
        {
            code: "require('events').EventEmitter.listenerCount;",
            env: { node: true },
            errors: ["'events.EventEmitter.listenerCount' was deprecated since v4. Use 'events.EventEmitter#listenerCount()' instead."],
        },
        {
            code: "require('events').listenerCount;",
            env: { node: true },
            errors: ["'events.listenerCount' was deprecated since v4. Use 'events.EventEmitter#listenerCount()' instead."],
        },
        {
            code: "require('freelist');",
            env: { node: true },
            errors: ["'freelist' module was deprecated since v4."],
        },
        {
            code: "require('fs').SyncWriteStream;",
            env: { node: true },
            errors: ["'fs.SyncWriteStream' was deprecated since v4."],
        },
        {
            code: "require('fs').exists;",
            env: { node: true },
            errors: ["'fs.exists' was deprecated since v4. Use 'fs.stat()' or 'fs.access()' instead."],
        },
        {
            code: "require('fs').lchmod;",
            env: { node: true },
            errors: ["'fs.lchmod' was deprecated since v0.4."],
        },
        {
            code: "require('fs').lchmodSync;",
            env: { node: true },
            errors: ["'fs.lchmodSync' was deprecated since v0.4."],
        },
        {
            code: "require('fs').lchown;",
            env: { node: true },
            errors: ["'fs.lchown' was deprecated since v0.4."],
        },
        {
            code: "require('fs').lchownSync;",
            env: { node: true },
            errors: ["'fs.lchownSync' was deprecated since v0.4."],
        },
        {
            code: "require('http').createClient;",
            env: { node: true },
            errors: ["'http.createClient' was deprecated since v0.10. Use 'http.request()' instead."],
        },
        {
            code: "require('module').requireRepl;",
            env: { node: true },
            errors: ["'module.requireRepl' was deprecated since v6. Use 'require(\"repl\")' instead."],
        },
        {
            code: "require('module').Module.requireRepl;",
            env: { node: true },
            errors: ["'module.Module.requireRepl' was deprecated since v6. Use 'require(\"repl\")' instead."],
        },
        {
            code: "require('module')._debug;",
            env: { node: true },
            errors: ["'module._debug' was deprecated since v9."],
        },
        {
            code: "require('module').Module._debug;",
            env: { node: true },
            errors: ["'module.Module._debug' was deprecated since v9."],
        },
        {
            code: "require('os').getNetworkInterfaces;",
            env: { node: true },
            errors: ["'os.getNetworkInterfaces' was deprecated since v0.6. Use 'os.networkInterfaces()' instead."],
        },
        {
            code: "require('os').tmpDir;",
            env: { node: true },
            errors: ["'os.tmpDir' was deprecated since v7. Use 'os.tmpdir()' instead."],
        },
        {
            code: "require('path')._makeLong;",
            env: { node: true },
            errors: ["'path._makeLong' was deprecated since v9. Use 'path.toNamespacedPath()' instead."],
        },
        {
            code: "require('punycode');",
            env: { node: true },
            errors: ["'punycode' module was deprecated since v7. Use 'https://www.npmjs.com/package/punycode' instead."],
        },
        {
            code: "require('readline').codePointAt;",
            env: { node: true },
            errors: ["'readline.codePointAt' was deprecated since v4."],
        },
        {
            code: "require('readline').getStringWidth;",
            env: { node: true },
            errors: ["'readline.getStringWidth' was deprecated since v6."],
        },
        {
            code: "require('readline').isFullWidthCodePoint;",
            env: { node: true },
            errors: ["'readline.isFullWidthCodePoint' was deprecated since v6."],
        },
        {
            code: "require('readline').stripVTControlCharacters;",
            env: { node: true },
            errors: ["'readline.stripVTControlCharacters' was deprecated since v6."],
        },
        {
            code: "require('sys');",
            env: { node: true },
            errors: ["'sys' module was deprecated since v0.3. Use 'util' module instead."],
        },
        {
            code: "require('tls').CleartextStream;",
            env: { node: true },
            errors: ["'tls.CleartextStream' was deprecated since v0.10."],
        },
        {
            code: "require('tls').CryptoStream;",
            env: { node: true },
            errors: ["'tls.CryptoStream' was deprecated since v0.12. Use 'tls.TLSSocket' instead."],
        },
        {
            code: "require('tls').SecurePair;",
            env: { node: true },
            errors: ["'tls.SecurePair' was deprecated since v6. Use 'tls.TLSSocket' instead."],
        },
        {
            code: "require('tls').createSecurePair;",
            env: { node: true },
            errors: ["'tls.createSecurePair' was deprecated since v6. Use 'tls.TLSSocket' instead."],
        },
        {
            code: "require('tls').parseCertString;",
            env: { node: true },
            errors: ["'tls.parseCertString' was deprecated since v8.6. Use 'querystring.parse()' instead."],
        },
        {
            code: "require('tty').setRawMode;",
            env: { node: true },
            errors: ["'tty.setRawMode' was deprecated since v0.10. Use 'tty.ReadStream#setRawMode()' (e.g. 'process.stdin.setRawMode()') instead."],
        },
        {
            code: "require('util').debug;",
            env: { node: true },
            errors: ["'util.debug' was deprecated since v0.12. Use 'console.error()' instead."],
        },
        {
            code: "require('util').error;",
            env: { node: true },
            errors: ["'util.error' was deprecated since v0.12. Use 'console.error()' instead."],
        },
        {
            code: "require('util').isArray;",
            env: { node: true },
            errors: ["'util.isArray' was deprecated since v4. Use 'Array.isArray()' instead."],
        },
        {
            code: "require('util').isBoolean;",
            env: { node: true },
            errors: ["'util.isBoolean' was deprecated since v4."],
        },
        {
            code: "require('util').isBuffer;",
            env: { node: true },
            errors: ["'util.isBuffer' was deprecated since v4. Use 'Buffer.isBuffer()' instead."],
        },
        {
            code: "require('util').isDate;",
            env: { node: true },
            errors: ["'util.isDate' was deprecated since v4."],
        },
        {
            code: "require('util').isError;",
            env: { node: true },
            errors: ["'util.isError' was deprecated since v4."],
        },
        {
            code: "require('util').isFunction;",
            env: { node: true },
            errors: ["'util.isFunction' was deprecated since v4."],
        },
        {
            code: "require('util').isNull;",
            env: { node: true },
            errors: ["'util.isNull' was deprecated since v4."],
        },
        {
            code: "require('util').isNullOrUndefined;",
            env: { node: true },
            errors: ["'util.isNullOrUndefined' was deprecated since v4."],
        },
        {
            code: "require('util').isNumber;",
            env: { node: true },
            errors: ["'util.isNumber' was deprecated since v4."],
        },
        {
            code: "require('util').isObject;",
            env: { node: true },
            errors: ["'util.isObject' was deprecated since v4."],
        },
        {
            code: "require('util').isPrimitive;",
            env: { node: true },
            errors: ["'util.isPrimitive' was deprecated since v4."],
        },
        {
            code: "require('util').isRegExp;",
            env: { node: true },
            errors: ["'util.isRegExp' was deprecated since v4."],
        },
        {
            code: "require('util').isString;",
            env: { node: true },
            errors: ["'util.isString' was deprecated since v4."],
        },
        {
            code: "require('util').isSymbol;",
            env: { node: true },
            errors: ["'util.isSymbol' was deprecated since v4."],
        },
        {
            code: "require('util').isUndefined;",
            env: { node: true },
            errors: ["'util.isUndefined' was deprecated since v4."],
        },
        {
            code: "require('util').log;",
            env: { node: true },
            errors: ["'util.log' was deprecated since v6. Use a third party module instead."],
        },
        {
            code: "require('util').print;",
            env: { node: true },
            errors: ["'util.print' was deprecated since v0.12. Use 'console.log()' instead."],
        },
        {
            code: "require('util').pump;",
            env: { node: true },
            errors: ["'util.pump' was deprecated since v0.10. Use 'stream.Readable#pipe()' instead."],
        },
        {
            code: "require('util').puts;",
            env: { node: true },
            errors: ["'util.puts' was deprecated since v0.12. Use 'console.log()' instead."],
        },
        {
            code: "require('util')._extend;",
            env: { node: true },
            errors: ["'util._extend' was deprecated since v6. Use 'Object.assign()' instead."],
        },
        {
            code: "require('vm').runInDebugContext;",
            env: { node: true },
            errors: ["'vm.runInDebugContext' was deprecated since v8."],
        },

        // ES2015 Modules
        {
            code: "import b from 'buffer'; new b.Buffer()",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "import * as b from 'buffer'; new b.Buffer()",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "import * as b from 'buffer'; new b.default.Buffer()",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'new buffer.default.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "import {Buffer as b} from 'buffer'; new b()",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "import b from 'buffer'; b.SlowBuffer",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import * as b from 'buffer'; b.SlowBuffer",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import * as b from 'buffer'; b.default.SlowBuffer",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'buffer.default.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import {SlowBuffer as b} from 'buffer';",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import domain from 'domain';",
            env: { es6: true },
            parserOptions: { sourceType: "module" },
            errors: ["'domain' module was deprecated since v4."],
        },

        {
            code: "new (require('buffer').Buffer)()",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["buffer.Buffer()"],
                ignoreGlobalItems: ["Buffer()", "new Buffer()"],
            }],
            errors: ["'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "require('buffer').Buffer()",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["new buffer.Buffer()"],
                ignoreGlobalItems: ["Buffer()", "new Buffer()"],
            }],
            errors: ["'buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },

        //----------------------------------------------------------------------
        // Global Variables
        //----------------------------------------------------------------------
        {
            code: "new Buffer;",
            env: { node: true },
            errors: ["'new Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "Buffer();",
            env: { node: true },
            errors: ["'Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "GLOBAL; /*globals GLOBAL*/",
            env: { node: true },
            errors: ["'GLOBAL' was deprecated since v6. Use 'global' instead."],
        },
        {
            code: "Intl.v8BreakIterator;",
            env: { node: true },
            errors: ["'Intl.v8BreakIterator' was deprecated since v7."],
        },
        {
            code: "require.extensions;",
            env: { node: true },
            errors: ["'require.extensions' was deprecated since v0.12. Use compiling them ahead of time instead."],
        },
        {
            code: "root;",
            env: { node: true },
            errors: ["'root' was deprecated since v6. Use 'global' instead."],
        },
        {
            code: "process.EventEmitter;",
            env: { node: true },
            errors: ["'process.EventEmitter' was deprecated since v0.6. Use 'require(\"events\")' instead."],
        },
        {
            code: "process.env.NODE_REPL_HISTORY_FILE;",
            env: { node: true },
            errors: ["'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4. Use 'NODE_REPL_HISTORY' instead."],
        },
        {
            code: "let {env: {NODE_REPL_HISTORY_FILE}} = process;",
            env: { node: true, es6: true },
            errors: ["'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4. Use 'NODE_REPL_HISTORY' instead."],
        },

        {
            code: "require('domain');",
            env: { node: true },
            errors: ["'domain' module was deprecated since v4."],
        },
        {
            code: "import domain from 'domain';",
            parserOptions: { sourceType: "module" },
            errors: ["'domain' module was deprecated since v4."],
        },

        {
            code: "new Buffer()",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["buffer.Buffer()", "new buffer.Buffer()"],
                ignoreGlobalItems: ["Buffer()"],
            }],
            errors: ["'new Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
        {
            code: "Buffer()",
            env: { node: true },
            options: [{ //
                ignoreModuleItems: ["buffer.Buffer()", "new buffer.Buffer()"],
                ignoreGlobalItems: ["new Buffer()"],
            }],
            errors: ["'Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead."],
        },
    ],
})
