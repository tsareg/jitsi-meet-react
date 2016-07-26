import React, { Component } from 'react';

import {
    APP_SCREEN,
    navigate
} from '../../app';

import {
    toggleCameraMuted,
    toggleMicrophoneMuted
} from '../../base/media';

import { ColorPalette } from '../../base/styles';

import { styles } from './styles';

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
     * Returns styles for mute button depending if camera or microphone is muted
     * or not.
     *
     * @param {('camera'|'microphone')} type - Button to get styles for.
     * @protected
     * @returns {{
     *      buttonStyle: Object
     *      iconName: string,
     *      iconStyle: Object
     * }}
     */
    _getMuteButtonStyles(type) {
        let buttonStyle;
        let iconName;
        let iconStyle;

        if (this.props[type + 'Muted']) {
            buttonStyle = {
                ...styles.toolbarButton,
                backgroundColor: ColorPalette.buttonUnderlay
            };
            iconName = this[type + 'MutedIcon'];
            iconStyle = {
                ...styles.icon,
                color: 'white'
            };
        }
        else {
            buttonStyle = styles.toolbarButton;
            iconName = this[type + 'Icon'];
            iconStyle = styles.icon;
        }

        return {
            buttonStyle,
            iconName,
            iconStyle
        };
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