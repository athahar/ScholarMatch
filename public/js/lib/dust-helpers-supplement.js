var extend = function extend(dust) {

    // Add new dust helpers in this style
    dust.helpers.link = function link(chunk, ctx, bodies, params) {
        'use strict';

        var href,
            host = ctx.getPath(false, ['context', 'pageInfo', 'hostName']),
            production,
            stage,
            sandbox,
            dev,
            cobrand,
            locale,
            pat,
            extension,
            type,
            str;

        // Get trailing part of url and extract extension, if any
        if (params) {
            if (params.href) {
                href = dust.helpers.tap(params.href, chunk, ctx);
                href = href.trim();
                pat = /\.[0-9a-z]{1,4}$/i;
                extension = href.match(pat);
            } else {
                return chunk.write(''); // if not href, generate empty output
            }
            if (params.type) {
                type = dust.helpers.tap(params.type, chunk, ctx);
                if (type === 'command') {
                    extension = ''; // Makes commands like xxx.do look like a command
                }
            }
        }
        // Determine system type: internal=dev/stage, external=production/sandbox
        if (host) {
            if (host.indexOf('stage') >= 0 || (process && process.env && /stag/gi.test(process.env.DEPLOY_ENV))) {
                stage = true;
            } else if (host.indexOf('localhost.paypal.com') >= 0) {
                dev = true;
            } else if (host.indexOf('sandbox') >= 0) {
                sandbox = true;
            } else {
                production = true;
            }
        } else {
            host = 'www.paypalobjects.com'; // Assume external path if no host
        }

        // If no extension or it has a query string, assume this is a command url
        if (!extension || href.indexOf('?') >= 0) {
            if (href.charAt(0) === '/') {
                // Normally cobrand will not be defined. country holds the desired  value. Since
                // we are not supporting cobrand in urls, apps will not get cobrand automatically.
                // If an app requires cobrand in urls, it can define res.locals.context.locality.cobrand =
                // res.locals.context.locality.country. We will not advertise this unless an actual
                // requirement comes up.
                cobrand = ctx.getPath(false, ['context', 'locality', 'cobrand']);
                if (cobrand) {
                    cobrand = cobrand.toLowerCase();
                    href = "/" + cobrand + href; // Prefix /cobrand to get server relative URL with cobrand
                }
            }
            return chunk.write(href);
        }

        // Has an extension so treat as resource url and need absolute url
        str = 'https://www.paypalobjects.com';

        extension[0] = extension[0].toLowerCase();
        if (extension[0] === '.js' || extension[0] === '.css') {
            if (stage || sandbox) {
                if (host.indexOf(':') >= 0) {
                    host = host.substring(0, host.indexOf(':'));
                }
                str = 'https://' + host;
            }
            href = str + (href.charAt(0) !== '/' ? '/' + href : href);
            return chunk.write(href);
        }

        //Must be non-js, e.g. some object under webstatic like images
        str = 'https://www.paypalobjects.com/webstatic';
        href = str + (href.charAt(0) !== '/' ? '/' + href : href);
        return chunk.write(href);
    };

    dust.helpers.provide = function provide(chunk, ctx, bodies, params) {
        'use strict';
        var resData,
            paramVals = {},
            k,
            localCtx = ctx,
            saveData = chunk.data;

        if (params) {
            localCtx = ctx.push(params); // make params available to all bodies
        }

        for (k in bodies) {
            if (k !== 'block') {
                chunk.data = [];
                resData = JSON.parse(bodies[k](chunk, localCtx).data.join(''));
                paramVals[k] = resData;
            }
        }
        chunk.data = saveData;

        // combine block-defined params with any existing ones.
        // A block param overrides if the name duplicates regular param name
        return bodies.block(chunk, localCtx.push(paramVals));

    };
};

if (typeof exports !== 'undefined') {
    module.exports = extend;
} else {
    /* global dust: true */
    extend(dust);
}