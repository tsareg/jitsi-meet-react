import React from 'react';
import Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { ColorPalette } from '../../base/styles';

import {
    AbstractToolbar,
    mapStateToProps
} from './AbstractToolbar';
import { styles } from './styles';

/**
 * The native container rendering the in call main buttons.
 *
 * @extends AbstractToolbar
 */
class Toolbar extends AbstractToolbar {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let underlayColor = ColorPalette.buttonUnderlay;
        let micButtonStyle;
        let micButtonIcon;
        if (this.props.microphoneMuted) {
            micButtonStyle = {
                ...styles.toolbarButton,
                backgroundColor: underlayColor
            };
            micButtonIcon = 'microphone-slash';
        }
        else {
            micButtonStyle = styles.toolbarButton;
            micButtonIcon = 'microphone';
        }

        return (
            <div style = { styles.toolbarContainer }>
                <button
                    onClick = { this._onMicrophoneMute }
                    style = { micButtonStyle }>
                    <Icon name = { micButtonIcon } style = { styles.icon } />
                </button>
                <button
                    onClick= { this._onHangup }
                    style = { {
                        ...styles.toolbarButton,
                        backgroundColor: ColorPalette.jitsiRed
                    } }>
                    <Icon name = "phone" style = { styles.icon } />
                </button>
                <button
                    onClick= { this._onCameraMute }
                    style = { styles.toolbarButton }>
                    <Icon name="camera" style = { styles.icon } />
                </button>
            </div>
        );
    }
}

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);