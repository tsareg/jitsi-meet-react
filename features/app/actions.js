import { setRoom } from '../base/conference';
import {
    getDomain,
    setDomain
} from '../base/connection';
import {
    loadConfig,
    setConfig
} from '../base/lib-jitsi-meet';

import {
    APP_WILL_MOUNT,
    APP_WILL_UNMOUNT
} from './actionTypes';
import {
    _getRouteToRender,
    _getRoomAndDomainFromUrlString
} from './functions';
import './reducer';

/**
 * Triggers an in-app navigation to a different route. Allows navigation to be
 * abstracted between the mobile and web versions.
 *
 * @param {(string|undefined)} urlOrRoom - The url or room name to which to
 * navigate.
 * @returns {Function}
 */
export function appNavigate(urlOrRoom) {
    return (dispatch, getState) => {
        const oldDomain = getDomain(getState());

        const { domain, room } = _getRoomAndDomainFromUrlString(urlOrRoom);

        // TODO Kostiantyn Tsaregradskyi: We should probably detect if user is
        // currently in a conference and ask her if she wants to close the
        // current conference and start a new one with the new room name or
        // domain.

        if (typeof domain === 'undefined' || oldDomain === domain) {
            // If both domain and room vars became undefined, that means we're
            // actually dealing with just room name and not with URL.
            dispatch(
                _setRoomAndNavigate(
                    typeof room === 'undefined' && typeof domain === 'undefined'
                        ? urlOrRoom
                        : room));
        } else if (oldDomain !== domain) {
            // Update domain without waiting for config to be loaded to prevent
            // race conditions when we will start to load config multiple times.
            dispatch(setDomain(domain));

            // If domain has changed, that means we need to load new config
            // for that new domain and set it, and only after that we can
            // navigate to different route.
            loadConfig(`https://${domain}`)
                .then(config => {
                    // We set room name only here to prevent race conditions on
                    // app start to not make app re-render conference page for
                    // two times.
                    dispatch(setRoom(room));
                    dispatch(setConfig(config));
                    _navigate(getState());
                });
        }
    };
}

/**
 * Signals that a specific App will mount (in the terms of React).
 *
 * @param {App} app - The App which will mount.
 * @returns {{
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }}
 */
export function appWillMount(app) {
    return {
        type: APP_WILL_MOUNT,
        app
    };
}

/**
 * Signals that a specific App will unmount (in the terms of React).
 *
 * @param {App} app - The App which will unmount.
 * @returns {{
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }}
 */
export function appWillUnmount(app) {
    return {
        type: APP_WILL_UNMOUNT,
        app
    };
}


/**
 * Sets room and navigates to new route if needed.
 *
 * @param {string} newRoom - New room name.
 * @private
 * @returns {Function}
 */
function _setRoomAndNavigate(newRoom) {
    return (dispatch, getState) => {
        const oldRoom = getState()['features/base/conference'].room;

        dispatch(setRoom(newRoom));

        const state = getState();
        const room = state['features/base/conference'].room;

        if (room !== oldRoom) {
            _navigate(state);
        }
    };
}

/**
 * Navigates to route corresponding to current room name.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {void}
 */
function _navigate(state) {
    const routeToRender = _getRouteToRender(state);
    const app = state['features/app'].app;

    app._navigate(routeToRender);
}
