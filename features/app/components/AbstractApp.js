import React, { Component } from 'react';

import { setRoom } from '../../base/conference';
import {
    localParticipantJoined,
    localParticipantLeft
} from '../../base/participants';

import { appWillMount, appWillUnmount } from '../actions';

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export class AbstractApp extends Component {
    /**
     * Init lib-jitsi-meet and create local participant when component is going
     * to be mounted.
     *
     * @inheritdoc
     */
    componentWillMount() {
        const dispatch = this.props.store.dispatch;

        dispatch(appWillMount(this));

        dispatch(setRoom(this._getRoomFromUrlString(this.props.url)));
        dispatch(localParticipantJoined());
    }

    /**
     * Dispose lib-jitsi-meet and remove local participant when component is
     * going to be unmounted.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        const dispatch = this.props.store.dispatch;

        dispatch(localParticipantLeft());

        dispatch(appWillUnmount(this));
    }

    /**
     * Create a ReactElement from the specified component, the specified props
     * and the props of this AbstractApp which are suitable for propagation to
     * the children of this Component.
     *
     * @param {Component} component - The component from which the ReactElement
     * is to be created.
     * @param {Object} props - The read-only React Component props with which
     * the ReactElement is to be initialized.
     * @returns {ReactElement}
     * @protected
     */
    _createElement(component, props) {
        /* eslint-disable no-unused-vars, lines-around-comment */
        const {
            // Don't propagate the dispatch and store props because they usually
            // come from react-redux and programmers don't really expect them to
            // be inherited but rather explicitly connected.
            dispatch, // eslint-disable-line react/prop-types
            store,
            // The url property was introduced to be consumed entirely by
            // AbstractApp.
            url,
            // The remaining props, if any, are considered suitable for
            // propagation to the children of this Component.
            ...thisProps
        } = this.props;
        /* eslint-enable no-unused-vars, lines-around-comment */

        // eslint-disable-next-line object-property-newline
        return React.createElement(component, { ...thisProps, ...props });
    }

    /**
     * Gets room name from URL object if any.
     *
     * @param {URL} url - URL object.
     * @protected
     * @returns {(string|undefined)}
     */
    _getRoomFromUrlObject(url) {
        let room;

        if (url) {
            room = url.pathname.substr(1).toLowerCase();

            // Convert empty string to undefined to simplify checks.
            if (room === '') {
                room = undefined;
            }
        }

        return room;
    }

    /**
     * Tries to get conference room name from URL.
     *
     * @param {(string|undefined)} url - URL passed to the app.
     * @protected
     * @returns {string}
     */
    _getRoomFromUrlString(url) {
        return this._getRoomFromUrlObject(this._urlStringToObject(url));
    }

    /**
     * Navigates this AbstractApp to (i.e. opens) a specific URL.
     *
     * @param {string} url - The URL to which to navigate this AbstractApp (i.e.
     * the URL to open).
     * @protected
     * @returns {void}
     */
    _openURL(url) {
        const room = this._getRoomFromUrlString(url);

        // TODO Kostiantyn Tsaregradskyi: We should probably detect if user is
        // currently in a conference and ask her if she wants to close the
        // current conference and start a new one with the new room name.

        this.props.store.dispatch(setRoom(room));
    }

    /**
     * Parses a string into a URL (object).
     *
     * @param {(string|undefined)} url - The URL to parse.
     * @protected
     * @returns {URL}
     */
    _urlStringToObject(url) {
        let urlObj;

        if (url) {
            try {
                urlObj = new URL(url);
            } catch (ex) {
                // The return value will signal the failure & the logged
                // exception will provide the details to the developers.
                console.error(`Failed to parse URL: ${url}`, ex);
            }
        }

        return urlObj;
    }
}

/**
 * AbstractApp component's property types.
 *
 * @static
 */
AbstractApp.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object,

    /**
     * The URL, if any, with which the app was launched.
     */
    url: React.PropTypes.string
};
