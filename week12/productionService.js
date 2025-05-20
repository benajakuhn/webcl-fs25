export { Service };

/**
 * Creating the production version of the service. Factory Pattern.
 * @param { String } baseUrl - where the remote web service resides
 * @return { ServiceType }
 * @constructor
 */
const Service = baseUrl => {

    const loadComment = id =>
        fetch(baseUrl + "/comments/" + id)
            .then(res => res.json());

    const errorHandler = msg => console.error(msg);

    return { loadComment, errorHandler }
};
