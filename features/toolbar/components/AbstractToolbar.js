import React, { Component } from 'react';

import {
    APP_SCREEN,
    navigate
} from '../../app';

import {
    toggleCameraMuted,
    toggleMicrophoneMuted
} from '../../base/media';

/**
 * Abstract (base) class for the conference call toolbar.
 *
 * @abstract
 */
export class AbstractToolbar extends Component {
    /**
     * Initializes new component instance.
     *
     * @param {Object} props - Initial props that component will receive.
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onCameraMute =  this._onCameraMute.bind(this);
        this._onHangup =  this._onHangup.bind(this);
        this._onMicrophoneMute =  this._onMicrophoneMute.bind(this);
    }

    /**
     * Dispatches action to mute camera.
     *
     * @protected
     * @returns {void}
     */
    _onCameraMute() {
        this.props.dispatch(toggleCameraMuted());
    }

    /**
     * Dispatches action to navigate to welcome screen.
     *
     * @protected
     * @returns {void}
     */
    _onHangup() {
        this.props.dispatch(
            navigate({
                navigator: this.props.navigator,
                screen: APP_SCREEN.WELCOME
            })
        );
    }

    /**
     * Dispatches action to mute microphone.
     *
     * @protected
     * @returns {void}
     */
    _onMicrophoneMute() {
        this.props.dispatch(toggleMicrophoneMuted());
    }
}

/**
 * AbstractToolbar component's property types.
 *
 * @static
 */
AbstractToolbar.propTypes = {
    cameraMuted: React.PropTypes.bool,
    dispatch: React.PropTypes.func,
    navigator: React.PropTypes.object,
    microphoneMuted: React.PropTypes.bool,
    visible: React.PropTypes.bool.isRequired
};

/**
 * Maps parts of media state to component props.
 *
 * @param {Object} state - Redux state.
 * @returns {{ cameraMuted: boolean, microphoneMuted: boolean }}
 */
export const mapStateToProps = state => {
    const stateFeaturesMedia = state['features/base/media'];

    return {
        cameraMuted: stateFeaturesMedia.camera.muted,
        microphoneMuted: stateFeaturesMedia.microphone.muted
    };
};