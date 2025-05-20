
export { service, setService }

/**
 * @typedef CommentType
 * @property { String } name - the only property that we currently care about
 */

/**
 * The interface that is implemented multiple times.
 * Analogous to the abstract factory design pattern.
 * @typedef ServiceType
 * @property { (id:!Number) => Promise<CommentType> } loadComment - async
 * @property { (msg:String) => void } errorHandler
 */

/** @type { ServiceType } */
let service;

/**
 * @param { ServiceType } newService
 */
const setService = newService => service = newService;
