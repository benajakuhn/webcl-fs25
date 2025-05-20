
export { Service }

/**
 * @typedef TestServiceOptionType
 * @property { CommentType }  comment  - test data to be return on happy days
 * @property { ?String }      error    - forcing the service to fail
 * @property { ?String }      msg      - output when things have failed (collecting parameter pattern)
 */

/**
 * @param { TestServiceOptionType } options - test instrumentation
 * @return { ServiceType }
 * @constructor
 */
const Service = options => {

    const loadComment = _id =>
        options.error
            ? Promise.reject(  options.error )
            : Promise.resolve( options.comment );

    const errorHandler = msg => options.msg = msg;

    return { loadComment, errorHandler }
};
