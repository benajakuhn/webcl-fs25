
import { service } from "./serviceHolder.js"

export { code }

/**
 * Just some random "code" that is asynchronously loading a {@link CommentType comment}.
 * @param { !Number} id - must not be negative (otherwise, return error string)
 * @return {Promise<CommentType> | String}
 */
const code = id =>
    id < 0
        ? "id not allowed to be < 0 but was: " + id
        : service.loadComment(id)
            .then(comment => out.textContent = comment.name)
            .catch( msg => {
                service.errorHandler(msg);
                return Promise.reject(msg);
            } );
